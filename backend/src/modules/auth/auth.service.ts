import bcrypt from 'bcryptjs';
import { ApiError } from '@/utils/apiError.js';
import { UserModel, type UserDocument } from '@/modules/user/user.model.js';
import { randomToken, sha256 } from '@/utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt.js';

export async function signup(input: {
  email: string;
  username: string;
  password: string;
}) {
  const email = input.email.toLowerCase().trim();
  const username = input.username.toLowerCase().trim();

  const passwordHash = await bcrypt.hash(input.password, 12);

  // Email verification token (kept for future use)
  const rawVerifyToken = randomToken(32);
  const verifyHash = sha256(rawVerifyToken);
  const verifyExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const user = await UserModel.create({
    email,
    username,
    passwordHash,
    isEmailVerified: false,
    emailVerificationTokenHash: verifyHash,
    emailVerificationExpiresAt: verifyExpiresAt
  });

  // NOTE: Email verification temporarily disabled
  // const verifyUrl = `${env.appBaseUrl}/api/v1/auth/verify-email?token=${rawVerifyToken}&email=${encodeURIComponent(email)}`;
  // await sendVerifyEmail(email, verifyUrl);

  // Create tokens immediately so signup also logs the user in
  const jti = randomToken(16);
  const refreshToken = signRefreshToken(String(user._id), jti);

  // Store refresh token hash on user
  await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshTokenJti: jti,
        refreshTokenHash: await bcrypt.hash(refreshToken, 12)
      }
    }
  );

  const accessToken = signAccessToken(String(user._id));

  return { tokens: { accessToken, refreshToken } };
}

export async function login(input: { emailOrUsername: string; password: string }) {
  const key = input.emailOrUsername.toLowerCase().trim();

  const user = await UserModel.findOne({
    $or: [{ email: key }, { username: key }]
  })
    .select('+passwordHash +refreshTokenHash +refreshTokenJti')
    .exec();

  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (user.isBanned) throw new ApiError(403, 'Account banned');

  const ok = await user.comparePassword(input.password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  user.lastLoginAt = new Date();

  // Create new refresh token (MVP: replace previous)
  const jti = randomToken(16);
  const refreshToken = signRefreshToken(String(user._id), jti);
  user.refreshTokenJti = jti;
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  await user.save();

  const accessToken = signAccessToken(String(user._id));

  return { tokens: { accessToken, refreshToken } };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  if (payload.type !== 'refresh') throw new ApiError(401, 'Invalid token');

  const user = await UserModel.findById(payload.sub).select('+refreshTokenHash +refreshTokenJti').exec();

  if (!user) throw new ApiError(401, 'Invalid token');
  if (!user.refreshTokenHash || !user.refreshTokenJti) throw new ApiError(401, 'No active session');
  if (user.refreshTokenJti !== payload.jti) throw new ApiError(401, 'Token revoked');

  const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!ok) throw new ApiError(401, 'Invalid token');

  const newJti = randomToken(16);
  const newRefreshToken = signRefreshToken(String(user._id), newJti);
  user.refreshTokenJti = newJti;
  user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
  await user.save();

  const accessToken = signAccessToken(String(user._id));

  return { accessToken, refreshToken: newRefreshToken };
}

export async function verifyEmail(input: { email: string; token: string }) {
  const email = input.email.toLowerCase().trim();
  const tokenHash = sha256(input.token);

  const user = await UserModel.findOne({ email })
    .select('+emailVerificationTokenHash +emailVerificationExpiresAt')
    .exec();

  if (!user) throw new ApiError(400, 'Invalid verification link');
  if (user.isEmailVerified) return { verified: true };

  if (!user.emailVerificationTokenHash || !user.emailVerificationExpiresAt) {
    throw new ApiError(400, 'No verification pending');
  }

  if (user.emailVerificationTokenHash !== tokenHash) throw new ApiError(400, 'Invalid verification link');
  if (user.emailVerificationExpiresAt.getTime() < Date.now()) throw new ApiError(400, 'Verification link expired');

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  // Use $unset in an update query to clear these fields properly
  await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        isEmailVerified: true,
        emailVerifiedAt: new Date()
      },
      $unset: {
        emailVerificationTokenHash: 1,
        emailVerificationExpiresAt: 1
      }
    }
  );

  return { verified: true };
}
