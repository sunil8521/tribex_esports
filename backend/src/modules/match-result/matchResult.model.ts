import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type ResultState = 'SUBMITTED' | 'VERIFIED' | 'DISPUTED' | 'FINALIZED';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IMatchStats {
    placement: number;       // 1st–12th
    kills: number;
    damageDealt?: number;
    survivalTime?: number;   // seconds
    assists?: number;
}

export interface IScore {
    placementPoints: number; // BGMI: 1st=15, 2nd=12...
    killPoints: number;      // 1 per kill
    total: number;
    bonus: number;           // Admin adjustments
}

export interface IMatchResult {
    matchID: Types.ObjectId;
    stageID: Types.ObjectId;
    tournamentID: Types.ObjectId;

    // Participant (one of these)
    userID?: Types.ObjectId;
    teamID?: Types.ObjectId;

    stats: IMatchStats;
    score: IScore;

    state: ResultState;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface MatchResultDocument extends IMatchResult, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const MatchStatsSchema = new Schema<IMatchStats>(
    {
        placement: { type: Number, required: true, min: 1, max: 12 },
        kills: { type: Number, required: true, min: 0, default: 0 },
        damageDealt: { type: Number, min: 0 },
        survivalTime: { type: Number, min: 0 },
        assists: { type: Number, min: 0 }
    },
    { _id: false }
);

const ScoreSchema = new Schema<IScore>(
    {
        placementPoints: { type: Number, required: true, default: 0 },
        killPoints: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true, default: 0 },
        bonus: { type: Number, default: 0 }
    },
    { _id: false }
);

const MatchResultSchema = new Schema<MatchResultDocument>(
    {
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
        tournamentID: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        },

        userID: { type: Schema.Types.ObjectId, ref: 'User' },
        teamID: { type: Schema.Types.ObjectId, ref: 'Team' },

        stats: { type: MatchStatsSchema, required: true },
        score: { type: ScoreSchema, required: true },

        state: {
            type: String,
            required: true,
            enum: ['SUBMITTED', 'VERIFIED', 'DISPUTED', 'FINALIZED'] satisfies ResultState[],
            default: 'SUBMITTED'
        }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

// Leaderboard aggregation across lobbies in a stage
MatchResultSchema.index({ stageID: 1, 'score.total': -1 });

// Per-lobby results
MatchResultSchema.index({ matchID: 1, 'score.total': -1 });

// One result per participant per match
MatchResultSchema.index(
    { matchID: 1, userID: 1 },
    { unique: true, partialFilterExpression: { userID: { $exists: true } } }
);
MatchResultSchema.index(
    { matchID: 1, teamID: 1 },
    { unique: true, partialFilterExpression: { teamID: { $exists: true } } }
);

/* ── Export ──────────────────────────────────────────────────── */

export const MatchResultModel = mongoose.model<MatchResultDocument>('MatchResult', MatchResultSchema);
