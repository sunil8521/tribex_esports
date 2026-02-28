import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type MatchState =
    | 'SCHEDULED'
    | 'REG_OPEN'
    | 'FULL'
    | 'LIVE'
    | 'RESULTS_PENDING'
    | 'COMPLETED'
    | 'ARCHIVED';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IParticipant {
    slotNumber: number;
    registrationID: Types.ObjectId;
    teamID?: Types.ObjectId;
    userID?: Types.ObjectId;
    teamName?: string;
    captainName?: string;

    checkIn: {
        status: boolean;
        checkedInAt?: Date;
    };
}

export interface IMatch {
    tournamentID: Types.ObjectId;
    stageID: Types.ObjectId;

    lobbyCode: string;
    maxSlots: number;

    participants: IParticipant[];

    state: MatchState;

    // Room credentials (encrypted at application layer)
    roomCredentials: {
        roomId?: string;
        password?: string;
    };

    // Schedule
    timeline: {
        regStart: Date;
        regEnd: Date;
        matchStart: Date;
        matchEnd?: Date;
    };

    createdAt?: Date;
    updatedAt?: Date;
}

export interface MatchDocument extends IMatch, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const ParticipantSchema = new Schema<IParticipant>(
    {
        slotNumber: { type: Number, required: true, min: 1, max: 12 },
        registrationID: { type: Schema.Types.ObjectId, ref: 'Registration', required: true },
        teamID: { type: Schema.Types.ObjectId, ref: 'Team' },
        userID: { type: Schema.Types.ObjectId, ref: 'User' },
        teamName: { type: String, trim: true },
        captainName: { type: String, trim: true },

        checkIn: {
            status: { type: Boolean, default: false },
            checkedInAt: { type: Date }
        }
    },
    { _id: false }
);

const MatchSchema = new Schema<MatchDocument>(
    {
        tournamentID: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        },

        stageID: {
            type: Schema.Types.ObjectId,
            ref: 'Stage',
            required: true
        },

        lobbyCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        maxSlots: { type: Number, required: true, default: 12, max: 12 },

        participants: {
            type: [ParticipantSchema],
            default: [],
            validate: {
                validator: (arr: IParticipant[]) => arr.length <= 12,
                message: 'A match cannot have more than 12 participants'
            }
        },

        state: {
            type: String,
            required: true,
            enum: [
                'SCHEDULED', 'REG_OPEN', 'FULL',
                'LIVE', 'RESULTS_PENDING', 'COMPLETED', 'ARCHIVED'
            ] satisfies MatchState[],
            default: 'SCHEDULED'
        },

        // Room credentials — encrypted at the service layer before storing
        roomCredentials: {
            roomId: { type: String, select: false },
            password: { type: String, select: false }
        },

        // Timeline
        timeline: {
            regStart: { type: Date, required: true },
            regEnd: { type: Date, required: true },
            matchStart: { type: Date, required: true },
            matchEnd: { type: Date }
        }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

// Find available lobby for registration (atomic slot claim)
MatchSchema.index({ stageID: 1, state: 1, lobbyCode: 1 });

// Fast lookup: all matches in a tournament
MatchSchema.index({ tournamentID: 1, stageID: 1 });

// Prevent duplicate lobby codes within a stage
MatchSchema.index({ stageID: 1, lobbyCode: 1 }, { unique: true });

/* ── Export ──────────────────────────────────────────────────── */

export const MatchModel = mongoose.model<MatchDocument>('Match', MatchSchema);
