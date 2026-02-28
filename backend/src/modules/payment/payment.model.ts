import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'failed' | 'refunded';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IPayment {
    registrationID: Types.ObjectId;
    userID: Types.ObjectId;
    tournamentID: Types.ObjectId;

    amount: number;
    orderID: string;           // Cashfree order_id (unique per order)
    status: PaymentStatus;
    transactionID: string;     // Our internal txn reference
    cfPaymentId?: string;      // Cashfree's cf_payment_id
    paymentMethod?: string;    // e.g. 'upi', 'card', 'netbanking'

    metadata?: Record<string, unknown>;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaymentDocument extends IPayment, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const PaymentSchema = new Schema<PaymentDocument>(
    {
        registrationID: {
            type: Schema.Types.ObjectId,
            ref: 'Registration',
            required: true,
            unique: true   // One payment per registration
        },

        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        tournamentID: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true,
            index: true
        },

        amount: { type: Number, required: true, min: 0 },

        orderID: {
            type: String,
            default: null,
            sparse: true,
            unique: true    // Cashfree order IDs are globally unique
        },

        status: {
            type: String,
            required: true,
            enum: ['pending', 'paid', 'cancelled', 'failed', 'refunded'] satisfies PaymentStatus[],
            default: 'pending'
        },

        transactionID: {
            type: String,
            required: true,
            unique: true
        },

        cfPaymentId: { type: String },
        paymentMethod: { type: String },

        metadata: { type: Schema.Types.Mixed }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

PaymentSchema.index({ userID: 1, tournamentID: 1 });
PaymentSchema.index({ tournamentID: 1, status: 1 });

/* ── Export ──────────────────────────────────────────────────── */

export const PaymentModel = mongoose.model<PaymentDocument>('Payment', PaymentSchema);
