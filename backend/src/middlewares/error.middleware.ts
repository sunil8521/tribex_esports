import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '@/utils/apiError.js';
import { logger } from '@/utils/logger.js';

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}
export function globalErrorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // MongoDB duplicate key error
  if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 11000) {
    const keyValue = (err as any).keyValue;
    const field = keyValue ? Object.keys(keyValue).join(', ') : 'field';
    logger.error(`${req.method} ${req.originalUrl} -> 409: Duplicate ${field}`, err as any);
    res.status(409).json({ success: false, message: `${field} already exists` });
    return;
  }

  const isApiError = err instanceof ApiError;

  const statusCode = isApiError
    ? err.statusCode
    : typeof (err as any)?.status === 'number'
      ? (err as any).status
      : 500;

  const message = isApiError
    ? err.message
    : (err as any)?.message
      ? String((err as any).message)
      : 'Internal Server Error';

  // Log full error server-side
  logger.error(`${req.method} ${req.originalUrl} -> ${statusCode}: ${message}`, err as any);

  const response: any = {
    success: false,
    message
  };

  // In development, include stack trace
  if (process.env.NODE_ENV !== 'production') {
    response.stack = (err as any)?.stack;
  }

  res.status(statusCode).json(response);
}
