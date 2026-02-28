import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type RegistrationStatus =
    | 'PENDING_PAYMENT'
    | 'CONFIRMED'
    | 'CHECKED_IN'
    | 'PLAYING'
    | 'COMPLETED'
    | 'NO_SHOW'
    | 'DISQUALIFIED'
    | 'CANCELLED';

export type ParticipantType = 'solo' | 'team';

export type PaymentStatus = 'pending' | 'completed' | 'refunded';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IPayment {
    amount: number;
    status: PaymentStatus;
    transactionID?: string;
    paidAt?: Date;
}

export interface IRegistration {
    tournamentID: Types.ObjectId;
    matchID: Types.ObjectId;
    stageID: Types.ObjectId;

    participantType: ParticipantType;
    userID: Types.ObjectId;         // Always set (the person who registered)
    teamID?: Types.ObjectId;        // Set when participantType === 'team'
    captainID?: Types.ObjectId;     // Who paid / registered the team

    status: RegistrationStatus;
    assignedSlot: number;           // 1–12 within the lobby

    payment: IPayment;

    // Auto-seeded registrations (advancing to next stage) skip payment
    isAutoSeeded: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface RegistrationDocument extends IRegistration, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const PaymentSchema = new Schema<IPayment>(
    {
        amount: { type: Number, required: true, min: 0, default: 0 },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'refunded'] satisfies PaymentStatus[],
            default: 'pending'
        },
        transactionID: { type: String, trim: true },
        paidAt: { type: Date }
    },
    { _id: false }
);

const RegistrationSchema = new Schema<RegistrationDocument>(
    {
        tournamentID: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        },
        matchID: {
            type: Schema.Types.ObjectId,
            ref: 'Match',
            required: true
        },
        stageID: {
            type: Schema.Types.ObjectId,
            ref: 'Stage',
            required: true
        },

        participantType: {
            type: String,
            required: true,
            enum: ['solo', 'team'] satisfies ParticipantType[]
        },

        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teamID: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        },
        captainID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        status: {
            type: String,
            required: true,
            enum: [
                'PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN',
                'PLAYING', 'COMPLETED', 'NO_SHOW', 'DISQUALIFIED', 'CANCELLED'
            ] satisfies RegistrationStatus[],
            default: 'CONFIRMED'
        },

        assignedSlot: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },

        payment: { type: PaymentSchema, default: () => ({ amount: 0, status: 'completed' }) },

        isAutoSeeded: { type: Boolean, default: false }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

// One registration per user per tournament (prevents double-registering)
RegistrationSchema.index({ userID: 1, tournamentID: 1 }, { unique: true });

// One registration per team per tournament
RegistrationSchema.index(
    { teamID: 1, tournamentID: 1 },
    { unique: true, partialFilterExpression: { teamID: { $exists: true } } }
);

// Fast: "Who is in this match?"
RegistrationSchema.index({ matchID: 1, status: 1 });

// Fast: "Show my registrations"
RegistrationSchema.index({ userID: 1, status: 1 });

/* ── Export ──────────────────────────────────────────────────── */

export const RegistrationModel = mongoose.model<RegistrationDocument>('Registration', RegistrationSchema);
