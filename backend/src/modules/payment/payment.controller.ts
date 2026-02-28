import type { Request, Response, RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as paymentService from './payment.service.js';
import { z } from 'zod';

/* ── Validation ────────────────────────────────────────────── */

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

const initiateSchema = z.object({
    body: z.object({
        registrationId: objectId,
        tournamentId: objectId
    })
});

const verifySchema = z.object({
    body: z.object({
        orderId: z.string().min(1, 'Order ID is required')
    })
});

/* ── Initiate Payment ──────────────────────────────────────── */

export const initiatePayment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { body } = initiateSchema.parse({ body: req.body });

    const result = await paymentService.createPaymentOrder(
        body.registrationId,
        req.userId!,
        body.tournamentId,
        0 // Amount will be fetched from registration/tournament inside the service
    );

    res.status(201).json({
        success: true,
        data: {
            paymentSessionId: result.paymentSessionId,
            orderId: result.orderId
        }
    });
});

/* ── Verify Payment ────────────────────────────────────────── */

export const verifyPayment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { body } = verifySchema.parse({ body: req.body });
    const result = await paymentService.verifyPayment(body.orderId, req.userId!);
    res.json({ success: true, data: result });
});

/* ── Webhook (Cashfree → Server) ───────────────────────────── */

export const webhook: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;

    if (!signature || !timestamp) {
        res.status(400).json({ success: false, message: 'Missing signature headers' });
        return;
    }

    // rawBody must be available — requires express.raw() middleware on this route
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const result = await paymentService.handleWebhook(signature, rawBody, timestamp);
    res.json({ success: true, ...result });
});

/* ── Callback URL (redirect from Cashfree checkout) ────────── */

export const paymentCallback: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.query.order_id as string;
    if (!orderId) {
        res.redirect('/payment/error');
        return;
    }
    // Redirect to frontend payment status page
    res.redirect(`/payment/status?order_id=${orderId}`);
});
