import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';
import { refresh as refreshTokens } from '../modules/auth/auth.service.js';
import { verifyAccessToken } from '../utils/jwt.js';

function getCookie(req: Request, name: string): string | undefined {
  return req.cookies?.[name] as string | undefined;
}

function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  const common = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite as 'lax' | 'strict' | 'none',
    domain: env.cookieDomain || undefined,
    path: '/'
  };

  // Access token: short-lived
  res.cookie('accessToken', tokens.accessToken, {
    ...common,
    maxAge: env.accessCookieMaxAgeMs
  });

  // Refresh token: long-lived
  res.cookie('refreshToken', tokens.refreshToken, {
    ...common,
    maxAge: env.refreshCookieMaxAgeMs
  });
}

export function clearAuthCookies(res: Response) {
  const common = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite as 'lax' | 'strict' | 'none',
    domain: env.cookieDomain || undefined,
    path: '/'
  };

  res.clearCookie('accessToken', common);
  res.clearCookie('refreshToken', common);
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = getCookie(req, 'accessToken');
  const refreshToken = getCookie(req, 'refreshToken');

  // Case 1: No access token, no refresh token → must login
  if (!accessToken && !refreshToken) {
    return next(new ApiError(401, 'Not authenticated'));
  }

  // Case 2: No access token, but has refresh token → try silent refresh
  if (!accessToken && refreshToken) {
    try {
      const tokens = await refreshTokens(refreshToken);
      setAuthCookies(res, tokens);

      const payload = verifyAccessToken(tokens.accessToken);
      req.userId = payload.sub;
      return next();
    } catch {
      // Refresh failed → clear cookies, force re-login
      clearAuthCookies(res);
      return next(new ApiError(401, 'Session expired'));
    }
  }

  // Case 3: Has access token → verify it
  try {
    const payload = verifyAccessToken(accessToken!);
    req.userId = payload.sub;
    return next();
  } catch (err) {
    // Case 3a: Access token expired → try silent refresh
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return next(new ApiError(401, 'Session expired'));
      }

      try {
        const tokens = await refreshTokens(refreshToken);
        setAuthCookies(res, tokens);

        const payload = verifyAccessToken(tokens.accessToken);
        req.userId = payload.sub;
        return next();
      } catch {
        // Refresh token invalid/expired
        clearAuthCookies(res);
        return next(new ApiError(401, 'Session expired'));
      }
    }

    // Case 3b: Access token invalid (not just expired)
    clearAuthCookies(res);
    return next(new ApiError(401, 'Invalid token'));
  }
}

export function attachAuthCookieHelpers(_req: Request, res: Response, next: NextFunction) {
  res.setAuthCookies = (tokens: { accessToken: string; refreshToken: string }) => setAuthCookies(res, tokens);
  res.clearAuthCookies = () => clearAuthCookies(res);
  next();
}
