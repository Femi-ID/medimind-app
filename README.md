# MediMind — Frontend

Context-aware healthcare personal assistant. Next.js 15 (App Router) + TypeScript +
Tailwind v4, talking to the MediMind NestJS backend.

## Prerequisites
- Node.js 20+
- The backend running/deployed (default points at the deployed Render instance).

## Setup
```bash
npm install
cp .env.example .env.local   # already provided; adjust if running the backend locally
npm run dev                  # http://localhost:3000
```

## Environment
| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL incl. `/api/v1` |
| `NEXT_PUBLIC_APP_URL` | This app's own origin |

## Auth model (important)
- Access token: kept **in memory** (Zustand), attached as `Authorization: Bearer`.
- Refresh token: **httpOnly cookie** set by the backend; the frontend never reads it.
  `withCredentials: true` is set globally so the cookie rides along on `/auth/*`.
- On load, `POST /auth/refresh` restores the session from the cookie.
- On any `401`: one single-flight refresh → retry once → else redirect to `/login`.
  (Concurrent refreshes are coalesced to avoid the backend's token-reuse revocation.)
- Route protection is **client-side** (`AuthGuard`), since tokens aren't in a
  server-readable cookie.

> Production hardening note: the refresh cookie is `SameSite=None; Secure`. Ensure the
> deployed frontend origin is added to the backend `CORS_ORIGIN` allow-list (exact match).

## Structure
- `src/lib/api/*` — typed API modules (one per backend domain) + the axios client.
- `src/lib/auth/store.ts` — in-memory auth store.
- `src/lib/validators/*` — Zod schemas mirroring backend DTOs.
- `src/components/ui/*` — design-system primitives.
- `src/app/(auth)` — public auth pages · `src/app/(app)` — protected pages.

Built page by page; see the build chat for the per-page history.
