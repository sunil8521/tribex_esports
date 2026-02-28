# TribeX eSports 🎮

A full-stack competitive esports tournament platform built for BGMI & FreeFire. Players can discover tournaments, register, join lobbies, and compete — while organizers manage the full tournament lifecycle from qualifiers to finals.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 · React 19 · TailwindCSS 4 · Zustand · TanStack Query · Framer Motion |
| **Backend** | Express 5 · TypeScript 5 · Mongoose 9 · MongoDB |
| **Auth** | JWT (httpOnly cookies) · Google OAuth · Silent token refresh |
| **Payments** | Cashfree PG (sandbox + production) |
| **Storage** | Cloudinary (avatars, tournament thumbnails) |
| **Security** | AES-256-GCM encryption (room credentials) · Helmet · Rate limiting · Zod validation |

---

## Project Structure

```
tribex-esports/
├── backend/                 # Express API server
│   └── src/
│       ├── config/          # env, DB, Cloudinary, Cashfree
│       ├── middlewares/     # auth, admin, error handler, rate limit
│       ├── modules/
│       │   ├── auth/        # Signup, login, Google OAuth, JWT
│       │   ├── user/        # Profile, avatar, password
│       │   ├── tournament/  # CRUD, status machine, stages
│       │   ├── stage/       # Qualifier → Semi → Final
│       │   ├── match/       # Lobbies, participants, room creds
│       │   ├── team/        # Solo / Duo / Squad teams
│       │   ├── registration/# Atomic lobby allocation + credentials
│       │   ├── payment/     # Cashfree order/verify/webhook
│       │   ├── match-result/# Scoring, leaderboard aggregation
│       │   └── advancement/ # Stage progression + auto-seeding
│       ├── routes/          # API router
│       └── utils/           # ApiError, asyncHandler, crypto
│
├── website/                 # Next.js frontend
│   ├── app/                 # Pages (App Router)
│   │   ├── tournaments/     # Browse + detail view
│   │   ├── live-tournaments/
│   │   ├── leaderboard/
│   │   ├── my-matches/
│   │   ├── my-tournaments/
│   │   ├── profile/
│   │   ├── login/ & signup/
│   │   └── blog/ & contact/
│   ├── components/          # UI components (Radix + shadcn/ui)
│   ├── store/               # Zustand (auth, query)
│   ├── lib/                 # API client, utils
│   └── types/               # TypeScript types
│
└── API_REFERENCE.md         # Full endpoint documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm
- **MongoDB** (local or Atlas)

### 1. Clone

```bash
git clone https://github.com/sunil8521/tribex-esports.git
cd tribex-esports
```

### 2. Backend Setup

```bash
cd backend
pnpm install
```

Create a `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/tribex-esports

# Auth
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Email (SMTP)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cashfree (sandbox keys for dev)
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret

# Optional
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

Start the dev server:

```bash
pnpm run dev         # Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd website
pnpm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the dev server:

```bash
pnpm run dev         # Runs on http://localhost:3000
```

---

## API Overview

> Full reference → [`API_REFERENCE.md`](./API_REFERENCE.md)

| Module | Base Path | Key Endpoints |
|--------|-----------|---------------|
| **Auth** | `/api/v1/auth` | signup, login, Google OAuth, `/me`, logout |
| **User** | `/api/v1/user` | profile update, password change, avatar upload |
| **Tournaments** | `/api/v1/tournaments` | list, detail, create (admin), stages + matches |
| **Registrations** | `/api/v1/registrations` | register, my registrations, cancel, get credentials |
| **Payments** | `/api/v1/payments` | initiate, verify, webhook (Cashfree) |
| **Match Results** | `/api/v1/match-results` | submit (admin), finalize, leaderboard |
| **Advancement** | `/api/v1/advancements` | process qualifiers (admin), seed next stage |

---

## Tournament Flow

```
Registration Opens
       │
       ▼
 Player Registers ──► Slot Assigned (Atomic)
       │
       ▼
 Payment (Cashfree) ──► CONFIRMED
       │
       ▼
 Room Credentials Revealed (T-15 min)
       │
       ▼
 Match Played
       │
       ▼
 Results Submitted ──► Leaderboard
       │
       ▼
 Advancement Processed
       │
       ▼
 Qualifier ──► Semi-Final ──► Final
```

---

## Key Features

- **Atomic Lobby Allocation** — MongoDB transactions ensure no double-booking of slots
- **Encrypted Room Credentials** — AES-256-GCM with time-gated reveal (15 min before match)
- **BGMI Scoring System** — Placement points (1st=15 → 12th=1) + kill points
- **Stage Leaderboard** — Aggregated ranking using MongoDB `$rank` window function
- **Advancement Engine** — Supports `PER_LOBBY` (top N from each) and `GLOBAL` (top N overall)
- **Auto-Seeding** — Qualified players are automatically registered into next stage lobbies
- **Cashfree Payments** — Full payment lifecycle with webhook verification

---

## Scripts

### Backend

```bash
pnpm run dev          # Development (tsx watch)
pnpm run build        # Production build
pnpm run start        # Start production
pnpm run typecheck    # TypeScript type check
```

### Frontend

```bash
pnpm run dev          # Development (Next.js)
pnpm run build        # Production build
pnpm run start        # Start production
pnpm run lint         # ESLint
```

---

## License

This project is private and not licensed for public use.
