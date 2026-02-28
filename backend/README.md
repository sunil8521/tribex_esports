# TribeX eSports Backend (MVP)

TypeScript + Express + MongoDB (Mongoose)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- Health: `GET http://localhost:5000/health`

## Environment

See `.env.example`.

## API (MVP)

### Auth

- `POST /api/v1/auth/signup` – create account + sends verify email
- `GET /api/v1/auth/verify-email?token=...&email=...` – verify email
- `POST /api/v1/auth/login` – login, sets **httpOnly cookies** (accessToken + refreshToken)
- `POST /api/v1/auth/google` – Google sign-in (frontend sends Google ID token)
- `POST /api/v1/auth/logout` – clears auth cookies

> No `/refresh` route: access token refresh happens automatically inside `requireAuth` middleware when the access token expires.

Example signup payload:

```json
{
  "email": "test@example.com",
  "username": "testuser",
  "displayName": "Test User",
  "password": "supersecret123"
}
```

## Project structure

- `src/server.ts` – bootstrap (db + listen)
- `src/app.ts` – express app setup (helmet, rate-limit, routes, global error handler)
- `src/modules/*` – feature modules (model/service/controller/routes)
- `src/middlewares/*` – global middlewares
- `src/utils/*` – helpers (logger, ApiError, asyncHandler)
