import mongoose, { Schema, type Document, type Types } from "mongoose"

/* ── Interfaces ─────────────────────────────────────────────── */

export interface ITeamMember {
  userID: Types.ObjectId
  role: "captain" | "member"
  joinedAt: Date
}

export interface TeamDocument extends Document {
  name: string
  tag: string
  captainID: Types.ObjectId
  members: ITeamMember[]
  maxSize: number
  createdAt?: Date
  updatedAt?: Date
}

/* ── Schema ─────────────────────────────────────────────────── */

const TeamSchema = new Schema<TeamDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    tag: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 5,
      match: [/^[A-Z0-9]+$/, "Tag can only contain uppercase letters and numbers"],
    },

    captainID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        _id: false,
        userID: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["captain", "member"],
          required: true,
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    maxSize: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
  },
  { timestamps: true }
)

/* ── Indexes ────────────────────────────────────────────────── */

TeamSchema.index({ captainID: 1 })
TeamSchema.index({ "members.userID": 1 })
TeamSchema.index({ name: 1 }, { unique: true })

/* ── Export ─────────────────────────────────────────────────── */

export const TeamModel =
  mongoose.models.Team ||
  mongoose.model<TeamDocument>("Team", TeamSchema)