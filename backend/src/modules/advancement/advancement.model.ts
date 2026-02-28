import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type AdvancementStatus =
    | 'QUALIFIED'       // Passed the stage criteria
    | 'SEEDED'          // Placed into next stage lobby
    | 'COMPLETED_STAGE' // Finished the next stage
    | 'ELIMINATED';     // Did not qualify

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IAdvancement {
    tournamentID: Types.ObjectId;

    // Participant
    participantID: Types.ObjectId;  // userID or teamID
    participantType: 'solo' | 'team';

    // Where they came from
    source: {
        stageID: Types.ObjectId;
        matchID?: Types.ObjectId;
        rankInMatch?: number;
        globalRank?: number;
    };

    // Where they're going
    target: {
        stageID?: Types.ObjectId;
        matchID?: Types.ObjectId;
        slotNumber?: number;
    };

    // Scores carried forward
    stats: {
        totalPoints: number;
        totalKills: number;
    };

    status: AdvancementStatus;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface AdvancementDocument extends IAdvancement, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const AdvancementSchema = new Schema<AdvancementDocument>(
    {
        tournamentID: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        },

        participantID: {
            type: Schema.Types.ObjectId,
            required: true
            // Could ref 'User' or 'Team' — no single ref constraint
        },
        participantType: {
            type: String,
            required: true,
            enum: ['solo', 'team']
        },

        source: {
            stageID: { type: Schema.Types.ObjectId, ref: 'Stage', required: true },
            matchID: { type: Schema.Types.ObjectId, ref: 'Match' },
            rankInMatch: { type: Number, min: 1 },
            globalRank: { type: Number, min: 1 }
        },

        target: {
            stageID: { type: Schema.Types.ObjectId, ref: 'Stage' },
            matchID: { type: Schema.Types.ObjectId, ref: 'Match' },
            slotNumber: { type: Number, min: 1, max: 12 }
        },

        stats: {
            totalPoints: { type: Number, default: 0 },
            totalKills: { type: Number, default: 0 }
        },

        status: {
            type: String,
            required: true,
            enum: ['QUALIFIED', 'SEEDED', 'COMPLETED_STAGE', 'ELIMINATED'] satisfies AdvancementStatus[],
            default: 'QUALIFIED'
        }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

// Fast: "Who qualified in this tournament?"
AdvancementSchema.index({ tournamentID: 1, status: 1, 'stats.totalPoints': -1 });

// Prevent duplicate advancement for same participant in same source stage
AdvancementSchema.index(
    { tournamentID: 1, participantID: 1, 'source.stageID': 1 },
    { unique: true }
);

/* ── Export ──────────────────────────────────────────────────── */

export const AdvancementModel = mongoose.model<AdvancementDocument>('Advancement', AdvancementSchema);
