import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { env } from './env.js';

/**
 * Cashfree PG SDK v5+ — constructor-based init.
 * Uses SANDBOX for development, PRODUCTION for production.
 */
export const cashfree = new Cashfree(
    env.nodeEnv === 'production'
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX,
    env.cashfreeAppId,
    env.cashfreeSecretKey
);
