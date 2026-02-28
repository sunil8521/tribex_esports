import dotenv from 'dotenv';

dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

type SameSite = 'lax' | 'strict' | 'none';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function bool(name: string, fallback: boolean) {
  const v = process.env[name];
  if (v == null) return fallback;
  return v === 'true' || v === '1';
}

export const env = {
  nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? 'development',
  port: Number(process.env.PORT ?? 5000),

  mongodbUri: required('MONGODB_URI'),

  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),

  // Auth
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? '30d',

  // Cookies
  cookieSecure: bool('COOKIE_SECURE', (process.env.NODE_ENV as NodeEnv) === 'production'),
  cookieSameSite: (process.env.COOKIE_SAMESITE as SameSite) ?? 'lax',
  cookieDomain: process.env.COOKIE_DOMAIN ?? '',
  accessCookieMaxAgeMs: Number(process.env.ACCESS_COOKIE_MAX_AGE_MS ?? 15 * 60 * 1000),
  refreshCookieMaxAgeMs: Number(process.env.REFRESH_COOKIE_MAX_AGE_MS ?? 30 * 24 * 60 * 60 * 1000),

  // Google
  googleClientId: required('GOOGLE_CLIENT_ID'),
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',

  // Email (SMTP)
  smtpUser: required('SMTP_USER'),
  smtpPass: required('SMTP_PASS'),
  appBaseUrl: process.env.APP_BASE_URL ?? `http://localhost:${process.env.PORT ?? 5000}`,

  // Cloudinary (for avatar uploads)
  cloudinaryName: process.env.CLOUDINARY_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',

  // Encryption (AES-256-GCM for room credentials)
  // MUST be a 64-char hex string (32 bytes). Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  encryptionKey: process.env.ENCRYPTION_KEY ?? 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',

  // Cashfree Payment Gateway
  cashfreeAppId: process.env.CASHFREE_APP_ID ?? '',
  cashfreeSecretKey: process.env.CASHFREE_SECRET_KEY ?? '',
};
