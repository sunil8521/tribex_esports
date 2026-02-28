import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Literal types ──────────────────────────────────────────── */

export type Game = 'BGMI' | 'FreeFire';
export type TournamentMode = 'solo' | 'duo' | 'squad';

export type TournamentStatus =
  | 'CREATED'
  | 'REG_OPEN'
  | 'REG_CLOSED'
  | 'QUAL_RUNNING'
  | 'QUAL_COMPLETE'
  | 'SEMI_RUNNING'
  | 'SEMI_COMPLETE'
  | 'FINALS'
  | 'COMPLETED'
  | 'CANCELLED';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface IPrizeEntry {
  rank: number;
  amount: number;
}

export interface ITournament {
  title: string;
  description: string;
  game: Game;
  mode: TournamentMode;
  eventCode: string;
  rules: string[];
  thumbnail: {
    url?: string;
    public_id?: string;
  };

  // Configuration
  maxTeamSize: number;
  slotDistribution: {
    qualifierLobbies: number;
    semiLobbies: number;
    finalLobbies: number;
  };

  // Economy
  entryFee: {
    amount: number;
    currency: string;
  };
  prizePool: IPrizeEntry[];

  // Counts (denormalized for fast reads)
  registeredCount: number;
  maxParticipants: number;

  // State machine
  status: TournamentStatus;

  // Schedule
  schedule: {
    regOpens: Date;
    regCloses: Date;
    qualifierStart: Date;
    semiStart?: Date;
    finalStart?: Date;
  };

  // Visibility
  isVisible: boolean;

  // Cancellation
  cancelledAt?: Date;
  cancellationReason?: string;

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TournamentDocument extends ITournament, Document { }

/* ── Helpers ─────────────────────────────────────────────────── */

function generateEventCode(): string {
  const prefix = 'TXE';
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${yyyy}${mm}-${random}`;
}

/* ── Schema ─────────────────────────────────────────────────── */

const PrizeEntrySchema = new Schema<IPrizeEntry>(
  {
    rank: { type: Number, required: true },
    amount: { type: Number, required: true }
  },
  { _id: false }
);

const TournamentSchema = new Schema<TournamentDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    game: {
      type: String,
      required: true,
      enum: ['BGMI', 'FreeFire'] satisfies Game[]
    },

    mode: {
      type: String,
      required: true,
      enum: ['solo', 'duo', 'squad'] satisfies TournamentMode[]
    },

    eventCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      default: generateEventCode,
      validate: {
        validator: (v: string) => /^TXE-\d{6}-[A-Z0-9]{6}$/.test(v),
        message: (props: { value: string }) =>
          `${props.value} is not a valid event code! Format should be TXE-YYYYMM-XXXXXX`
      }
    },

    rules: { type: [String], default: [] },

    thumbnail: {
      url: { type: String },
      public_id: { type: String }
    },

    // Configuration
    maxTeamSize: { type: Number, required: true, min: 1, max: 4 },

    slotDistribution: {
      qualifierLobbies: { type: Number, required: true, min: 1 },
      semiLobbies: { type: Number, required: true, min: 0 },
      finalLobbies: { type: Number, required: true, min: 1 }
    },

    // Economy
    entryFee: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, default: 'INR' }
    },

    prizePool: { type: [PrizeEntrySchema], default: [] },

    // Denormalized counts
    registeredCount: { type: Number, default: 0 },
    maxParticipants: { type: Number, required: true },

    // State machine
    status: {
      type: String,
      required: true,
      enum: [
        'CREATED', 'REG_OPEN', 'REG_CLOSED',
        'QUAL_RUNNING', 'QUAL_COMPLETE',
        'SEMI_RUNNING', 'SEMI_COMPLETE',
        'FINALS', 'COMPLETED', 'CANCELLED'
      ] satisfies TournamentStatus[],
      default: 'CREATED'
    },

    // Schedule
    schedule: {
      regOpens: { type: Date, required: true },
      regCloses: { type: Date, required: true },
      qualifierStart: { type: Date, required: true },
      semiStart: { type: Date },
      finalStart: { type: Date }
    },

    // Cancellation
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true },

    // Admin visibility control
    isVisible: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

TournamentSchema.index({ status: 1, 'schedule.qualifierStart': 1 });
TournamentSchema.index({ game: 1, status: 1 });

/* ── Export ──────────────────────────────────────────────────── */

export const TournamentModel = mongoose.model<TournamentDocument>('Tournament', TournamentSchema);
