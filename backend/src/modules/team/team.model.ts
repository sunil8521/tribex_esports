import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ── Interfaces ─────────────────────────────────────────────── */

export interface ITeamMember {
    userID: Types.ObjectId;
    role: 'captain' | 'member';
    joinedAt: Date;
}

export interface ITeam {
    name: string;
    tag: string;               // 2-5 char clan tag, e.g. "TXE"
    captainID: Types.ObjectId;
    members: ITeamMember[];
    maxSize: number;            // 1 (solo), 2 (duo), 4 (squad)

    createdAt?: Date;
    updatedAt?: Date;
}

export interface TeamDocument extends ITeam, Document { }

/* ── Schema ─────────────────────────────────────────────────── */

const TeamMemberSchema = new Schema<ITeamMember>(
    {
        userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
            type: String,
            required: true,
            enum: ['captain', 'member'],
            default: 'member'
        },
        joinedAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const TeamSchema = new Schema<TeamDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30
        },

        tag: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            minlength: 2,
            maxlength: 5,
            match: [/^[A-Z0-9]+$/, 'Tag can only contain uppercase letters and numbers']
        },

        captainID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        members: {
            type: [TeamMemberSchema],
            default: [],
            validate: {
                validator: function (this: TeamDocument, arr: ITeamMember[]) {
                    return arr.length <= this.maxSize;
                },
                message: 'Team exceeds max size'
            }
        },

        maxSize: { type: Number, required: true, min: 1, max: 4 }
    },
    { timestamps: true }
);

/* ── Indexes ────────────────────────────────────────────────── */

// Fast lookup: find teams by captain
TeamSchema.index({ captainID: 1 });

// Fast lookup: find teams a user belongs to
TeamSchema.index({ 'members.userID': 1 });

// Unique team name
TeamSchema.index({ name: 1 }, { unique: true });

/* ── Export ──────────────────────────────────────────────────── */

export const TeamModel = mongoose.model<TeamDocument>('Team', TeamSchema);
