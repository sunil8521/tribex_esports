import mongoose, { Schema, type Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { getProfileImage } from '../../utils/getProfileImage.js';

export type UserRole = 'user' | 'admin';

export interface IUser {
  email: string;
  username: string;
  passwordHash?: string;
  role: UserRole;
  

  isEmailVerified: boolean;
  emailVerifiedAt?: Date;

  isBanned: boolean;
  lastLoginAt?: Date;

  // Email verification
  emailVerificationTokenHash?: string;
  emailVerificationExpiresAt?: Date;

  // Refresh token (MVP: single active session)
  refreshTokenHash?: string;
  refreshTokenJti?: string;
  userProfileImage: string;

  // Google auth
  googleSub?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
      match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores']
    },
    passwordHash: {
      type: String,
      required: false,
      select: false
    },
    userProfileImage: {
      type: String,
      default: () => getProfileImage()
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: {
      type: Date
    },

    isBanned: {
      type: Boolean,
      default: false
    },
    lastLoginAt: {
      type: Date
    },

    emailVerificationTokenHash: {
      type: String,
      select: false
    },
    emailVerificationExpiresAt: {
      type: Date,
      select: false
    },

    refreshTokenHash: {
      type: String,
      select: false
    },
    refreshTokenJti: {
      type: String,
      select: false
    },

    googleSub: {
      type: String,
      index: true,
      sparse: true
    }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function comparePassword(candidate: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidate, this.passwordHash);
};

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
