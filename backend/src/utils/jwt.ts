import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AccessTokenPayload = {
  sub: string; // userId
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string; // userId
  type: 'refresh';
  jti: string; // token id
};

export function signAccessToken(userId: string) {
  const payload: AccessTokenPayload = { sub: userId, type: 'access' };
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl as any });
}

export function signRefreshToken(userId: string, jti: string) {
  const payload: RefreshTokenPayload = { sub: userId, type: 'refresh', jti };
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.refreshTokenTtl as any });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
}
