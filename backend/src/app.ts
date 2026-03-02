import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';


import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { notFound, globalErrorHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routes/index.js';
import { attachAuthCookieHelpers } from './middlewares/auth.middleware.js';

export function createApp(): express.Application {
  const app = express();

  // Trust proxy if behind nginx / render / railway etc.
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin,
      credentials: true
    })
  );

  // Rate limiting (basic global limiter)
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      limit: env.rateLimitMax,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please try again later.' }
    })
  );

  // Cookies
  app.use(cookieParser());
  app.use(attachAuthCookieHelpers);


  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // HTTP request logging
  app.use(
    morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
      stream: {
        write: (msg) => logger.http(msg.trim())
      }
    })
  );

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', env: env.nodeEnv });
  });

  // API
  app.use('/api/v1', apiRouter);

  // 404
  app.use(notFound);

  // Error handler
  app.use(globalErrorHandler);

  return app;
}

