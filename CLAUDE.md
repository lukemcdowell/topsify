# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (binds to 127.0.0.1:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Environment Variables

Required in `.env.local`:

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=      # Must be http://127.0.0.1:3000/api/callback for local dev (see note below)
MOCK=true                  # Optional: use mock data instead of live Spotify API
```

Setting `MOCK=true` bypasses Spotify auth and serves data from `src/mock/`.

**Local dev redirect URI:** Spotify no longer accepts `http://localhost` as a redirect URI (not considered secure). Use `http://127.0.0.1:3000/api/callback` instead — Spotify allows this as an RFC 8252 loopback exception. The dev server is configured with `--hostname 127.0.0.1` so that Next.js treats `127.0.0.1` as canonical and doesn't redirect to `localhost`, which would break the CSRF state cookie. Access the app at `http://127.0.0.1:3000` during development.

## Architecture

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui (zinc base color, dark mode only).

**Auth flow (Spotify OAuth 2.0):**

1. Unauthenticated users hit `/` → middleware redirects to `/continue`
2. User clicks "Continue with Spotify" → hits `/api/login` → redirects to Spotify
3. Spotify redirects to `/api/callback` → tokens stored as httpOnly cookies (`access_token`, `refresh_token`)
4. On subsequent visits, middleware checks for `access_token`; if missing but `refresh_token` exists, redirects to `/api/refresh`
5. The middleware runs on `/`, `/tracks`, and `/artists` (see `matcher` in `src/middleware.ts`)
6. If refresh fails or no tokens exist, user is redirected to `/continue`

**API routes** (`src/app/api/`):

- `GET /api/login` — initiates OAuth, sets CSRF `state` cookie
- `GET /api/callback` — validates state, exchanges code for tokens
- `GET /api/refresh` — refreshes `access_token` using `refresh_token`
- `GET /api/top?type=tracks|artists&limit=N&timeRange=long_term|medium_term|short_term` — fetches top items; uses mock data if `MOCK=true`
- `POST /api/createPlaylist` — creates a Spotify playlist from supplied URIs; for `type=artists`, resolves each artist's top track URI first

**Pages:**

- `/` — dashboard showing top 5 tracks and top 5 artists (long_term only)
- `/tracks` — top 50 tracks with time range selector and playlist creation
- `/artists` — top 50 artists with time range selector and playlist creation
- `/continue` — unauthenticated landing page

**Data flow on `/tracks` and `/artists`:** All three time ranges (`long_term`, `medium_term`, `short_term`) are fetched in parallel on mount; only `long_term` blocks the loading state. The selected time range switches the displayed data client-side without re-fetching.

**Spotify API wrapper** (`src/lib/spotifyApi.ts`): All direct Spotify API calls live here. Uses `getEnvVariable()` from `src/lib/utils.ts` which throws at startup if any required env var is missing.

**UI components** use shadcn/ui primitives from `src/components/ui/`. Custom components (e.g. `TopTrack`, `TopArtist`, `Top5Card`, `Top50Grid`, `PageHeader`, `CreatePlaylist`) are in `src/components/`.
