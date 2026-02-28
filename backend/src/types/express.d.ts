import type { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }

    interface Response {
      setAuthCookies(tokens: { accessToken: string; refreshToken: string }): void;
      clearAuthCookies(): void;
    }
  }
}

export {};
