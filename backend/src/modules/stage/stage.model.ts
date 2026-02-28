import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type StageName = 'QUALIFIER' | 'SEMI_FINAL' | 'FINAL';
export type AdvancementType = 'PER_LOBBY' | 'GLOBAL';

export type StageStatus =
    | 'PENDING'
    | 'ALLOCATING'
    | 'IN_PROGRESS'
    | 'SCORING'
    | 'COMPLETE';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IAdvanceConfig {
    advancementType: AdvancementType;
    topNFromEachLobby?: number;   // Used when advancementType is PER_LOBBY
    totalAdvancing: number;       // Total teams advancing to next stage
    minScoreThreshold?: number;   // Optional minimum score to qualify
}

export interface IStage {
    tournamentID: Types.ObjectId;
    name: StageName;
    sequence: number;             // 1 = Qualifier, 2 = Semi, 3 = Final

    advanceConfig: IAdvanceConfig;
    status: StageStatus;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface StageDocument extends IStage, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const AdvanceConfigSchema = new Schema<IAdvanceConfig>(
    {
        advancementType: {
            type: String,
            required: true,
            enum: ['PER_LOBBY', 'GLOBAL'] satisfies AdvancementType[]
        },
        topNFromEachLobby: { type: Number, min: 1 },
        totalAdvancing: { type: Number, required: true, min: 0 },
        minScoreThreshold: { type: Number, min: 0 }
    },
    { _id: false }
);

const StageSchema = new Schema<StageDocument>(
    {
        tournamentID: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        },

        name: {
            type: String,
            required: true,
            enum: ['QUALIFIER', 'SEMI_FINAL', 'FINAL'] satisfies StageName[]
        },

        sequence: { type: Number, required: true, min: 1, max: 3 },

        advanceConfig: { type: AdvanceConfigSchema, required: true },

        status: {
            type: String,
            required: true,
            enum: [
                'PENDING', 'ALLOCATING', 'IN_PROGRESS', 'SCORING', 'COMPLETE'
            ] satisfies StageStatus[],
            default: 'PENDING'
        }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

StageSchema.index({ tournamentID: 1, sequence: 1 }, { unique: true });

/* ── Export ──────────────────────────────────────────────────── */

export const StageModel = mongoose.model<StageDocument>('Stage', StageSchema);
