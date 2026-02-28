import crypto from 'crypto';
import type { PaymentEntity } from 'cashfree-pg';
import { cashfree } from '../../config/cashfree.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { PaymentModel } from './payment.model.js';
import { RegistrationModel } from '../registration/registration.model.js';
import { TournamentModel } from '../tournament/tournament.model.js';
import { UserModel } from '../user/user.model.js';

/* ── Helpers ───────────────────────────────────────────────── */

function generateTxnId(): string {
    return `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

/* ═══════════════════════════════════════════════════════════════
   createPaymentOrder
   ─ Creates a Cashfree order and returns payment_session_id
     for the frontend to open the checkout.
   ═══════════════════════════════════════════════════════════════ */

export async function createPaymentOrder(
    registrationId: string,
    userId: string,
    tournamentId: string,
    amount: number
) {
    // Don't allow duplicate payment for same registration
    const existing = await PaymentModel.findOne({
        registrationID: registrationId,
        status: { $in: ['pending', 'paid'] }
    }).lean();

    if (existing?.status === 'paid') {
        throw new ApiError(400, 'Payment already completed for this registration');
    }

    // If there's an existing pending payment, return its session
    if (existing?.orderID) {
        // Fetch fresh order status from Cashfree
        const orderStatus = await cashfree.PGFetchOrder(existing.orderID);
        if (orderStatus.data?.payment_session_id) {
            return {
                paymentSessionId: orderStatus.data.payment_session_id,
                orderId: existing.orderID,
                existingPayment: true
            };
        }
    }

    // Get user details for Cashfree customer_details
    const user = await UserModel.findById(userId).select('email username').lean();
    if (!user) throw new ApiError(404, 'User not found');

    const transactionID = generateTxnId();
    const orderId = `ORDER-${registrationId}-${Date.now()}`;

    // Create Cashfree order
    const orderRequest = {
        order_amount: amount,
        order_currency: 'INR',
        order_id: orderId,
        customer_details: {
            customer_id: userId,
            customer_email: user.email,
            customer_phone: '9999999999', // Placeholder — no phone in User model
            customer_name: user.username ?? 'Player'
        },
        order_meta: {
            return_url: `${env.appBaseUrl}/api/v1/payments/callback?order_id={order_id}`,
            notify_url: `${env.appBaseUrl}/api/v1/payments/webhook`
        },
        order_note: `Tournament entry fee — Registration ${registrationId}`
    };

    const cfResponse = await cashfree.PGCreateOrder(orderRequest);

    if (!cfResponse.data?.payment_session_id) {
        throw new ApiError(502, 'Failed to create Cashfree payment order');
    }

    // Create or update payment record
    if (existing) {
        await PaymentModel.updateOne(
            { _id: existing._id },
            {
                $set: {
                    orderID: orderId,
                    transactionID,
                    status: 'pending'
                }
            }
        );
    } else {
        await PaymentModel.create({
            registrationID: registrationId,
            userID: userId,
            tournamentID: tournamentId,
            amount,
            orderID: orderId,
            status: 'pending',
            transactionID
        });
    }

    return {
        paymentSessionId: cfResponse.data.payment_session_id,
        orderId,
        existingPayment: false
    };
}

/* ═══════════════════════════════════════════════════════════════
   verifyPayment
   ─ Called by frontend after checkout completes.
     Fetches order status from Cashfree and updates our records.
   ═══════════════════════════════════════════════════════════════ */

export async function verifyPayment(orderId: string, userId: string) {
    const payment = await PaymentModel.findOne({ orderID: orderId });
    if (!payment) throw new ApiError(404, 'Payment not found');

    if (payment.userID.toString() !== userId) {
        throw new ApiError(403, 'Not your payment');
    }

    // Already paid? Skip Cashfree API call
    if (payment.status === 'paid') {
        return { status: 'paid', message: 'Payment already verified' };
    }

    // Fetch latest status from Cashfree
    const cfOrder = await cashfree.PGFetchOrder(orderId);
    const orderData = cfOrder.data;

    if (!orderData) {
        throw new ApiError(502, 'Failed to fetch order status from Cashfree');
    }

    const cfStatus = orderData.order_status; // 'PAID' | 'ACTIVE' | 'EXPIRED' etc.

    if (cfStatus === 'PAID') {
        // Get payment details
        const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId);
        const payments = paymentsResponse.data;
        const successPayment: PaymentEntity | undefined = Array.isArray(payments)
            ? payments.find((p) => p.payment_status === 'SUCCESS')
            : undefined;

        payment.status = 'paid';
        payment.cfPaymentId = successPayment?.cf_payment_id?.toString() ?? '';
        payment.paymentMethod = successPayment?.payment_group?.toString() ?? '';
        payment.metadata = { cfOrderStatus: cfStatus, cfAmount: orderData.order_amount };
        await payment.save();

        // Update registration → CONFIRMED
        await RegistrationModel.updateOne(
            { _id: payment.registrationID },
            {
                $set: {
                    status: 'CONFIRMED',
                    'payment.status': 'completed',
                    'payment.transactionID': payment.transactionID,
                    'payment.paidAt': new Date()
                }
            }
        );

        return { status: 'paid', message: 'Payment verified successfully' };
    }

    if (cfStatus === 'EXPIRED' || cfStatus === 'TERMINATED') {
        payment.status = 'failed';
        payment.metadata = { cfOrderStatus: cfStatus };
        await payment.save();

        return { status: 'failed', message: `Payment ${cfStatus.toLowerCase()}` };
    }

    // Still active / processing
    return { status: 'pending', message: 'Payment is still processing' };
}

/* ═══════════════════════════════════════════════════════════════
   handleWebhook
   ─ Cashfree calls this on payment events.
     Signature is verified, then we update records.
   ═══════════════════════════════════════════════════════════════ */

export async function handleWebhook(
    signature: string,
    rawBody: string,
    timestamp: string
) {
    // Verify webhook signature (instance method in SDK v5+)
    try {
        cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch {
        throw new ApiError(401, 'Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody);
    const eventType: string = payload.type;   // e.g. 'PAYMENT_SUCCESS_WEBHOOK'
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;

    if (!orderData?.order_id) return { received: true };

    const orderId: string = orderData.order_id;
    const payment = await PaymentModel.findOne({ orderID: orderId });

    if (!payment) {
        // Unknown order — just acknowledge
        return { received: true, ignored: true };
    }

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || orderData.order_status === 'PAID') {
        if (payment.status === 'paid') return { received: true }; // Idempotent

        payment.status = 'paid';
        payment.cfPaymentId = paymentData?.cf_payment_id?.toString();
        payment.paymentMethod = paymentData?.payment_group;
        payment.metadata = payload.data;
        await payment.save();

        // Confirm the registration
        await RegistrationModel.updateOne(
            { _id: payment.registrationID },
            {
                $set: {
                    status: 'CONFIRMED',
                    'payment.status': 'completed',
                    'payment.transactionID': payment.transactionID,
                    'payment.paidAt': new Date()
                }
            }
        );
    } else if (
        eventType === 'PAYMENT_FAILED_WEBHOOK' ||
        orderData.order_status === 'EXPIRED'
    ) {
        payment.status = 'failed';
        payment.metadata = payload.data;
        await payment.save();
    }

    return { received: true };
}

/* ═══════════════════════════════════════════════════════════════
   getPaymentByRegistration — lookup helper
   ═══════════════════════════════════════════════════════════════ */

export async function getPaymentByRegistration(registrationId: string) {
    return PaymentModel.findOne({ registrationID: registrationId }).lean();
}
