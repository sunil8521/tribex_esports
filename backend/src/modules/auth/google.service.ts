import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { ApiError } from '@/utils/apiError.js';
import { UserModel, type UserDocument } from '@/modules/user/user.model.js';
import { env } from '@/config/env.js';
import { randomToken } from '@/utils/crypto.js';
import { signAccessToken, signRefreshToken } from '@/utils/jwt.js';

const client = new OAuth2Client();

export async function googleLogin(input: { idToken: string }) {
  const ticket = await client.verifyIdToken({
    idToken: input.idToken,
    audience: env.googleClientId
  });

  const payload = ticket.getPayload();
  if (!payload) throw new ApiError(401, 'Invalid Google token');

  const email = (payload.email ?? '').toLowerCase().trim();
  if (!email) throw new ApiError(400, 'Google account has no email');
  if (!payload.email_verified) throw new ApiError(400, 'Google email not verified');

  // Use "sub" as stable Google user id
  const googleSub = payload.sub;

  let user: UserDocument | null = await UserModel.findOne({ email })
    .select('+refreshTokenHash +refreshTokenJti')
    .exec();

  if (!user) {
    // Create new user for Google sign-in
    const baseUsername = (payload.given_name || payload.name || email.split('@')[0] || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20);

    const username = `${baseUsername}_${randomToken(3)}`; // ensure uniqueness cheaply

    const newUser = await UserModel.create({
      email,
      username,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      googleSub
    });

    user = await UserModel.findById(newUser._id).select('+refreshTokenHash +refreshTokenJti').exec();
  } else {
    // If user existed from password signup but later uses Google, link the account
    if (!user.googleSub) {
      user.googleSub = googleSub;
    }
  }

  if (!user) throw new ApiError(500, 'User creation failed');
  if (user.isBanned) throw new ApiError(403, 'Account banned');

  // New refresh token (MVP: replace previous)
  const jti = randomToken(16);
  const refreshToken = signRefreshToken(String(user._id), jti);
  user.refreshTokenJti = jti;
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken(String(user._id));

  return { tokens: { accessToken, refreshToken } };
}
