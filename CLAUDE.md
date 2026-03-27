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

1. Unauthenticated users hit `/` — a public login landing page
2. User clicks "Continue with Spotify" → hits `/api/login` → redirects to Spotify
3. Spotify redirects to `/api/callback` → tokens stored as httpOnly cookies (`access_token`, `refresh_token`) → redirects to `/dashboard`
4. The middleware (`src/proxy.ts`) runs on `/`, `/dashboard`, `/dashboard/tracks`, `/dashboard/artists`, and `/dashboard/genres`:
   - `/dashboard` without a `refresh_token` cookie → redirects to `/`
   - `/` with a `refresh_token` cookie → redirects to `/dashboard`
5. Each authenticated page (server component) calls `getValidAccessToken()` from `src/lib/auth.ts` as a fine-grained auth guard:
   - Has `access_token` → returns it and renders the page
   - No `access_token` but has `refresh_token` → redirects to `/api/refresh?redirect=/dashboard`
   - No tokens → redirects to `/`
6. `GET /api/refresh` refreshes the `access_token`, then redirects to the `?redirect=` param (defaults to `/dashboard`)
7. If refresh fails or no tokens exist, user is redirected to `/`

**Cookie names** are centralised in `src/lib/cookies.ts` (`COOKIE_NAMES`). All API routes and auth helpers import from there.

**API routes** (`src/app/api/`):

- `GET /api/login` — initiates OAuth, sets CSRF `state` cookie
- `GET /api/callback` — validates state, exchanges code for tokens, redirects to `/dashboard`
- `GET /api/refresh?redirect=<path>` — refreshes `access_token` using `refresh_token`, redirects to `redirect` param
- `GET /api/logout` — clears `access_token` and `refresh_token` cookies, redirects to `/`
- `GET /api/top?type=tracks|artists&limit=N&timeRange=long_term|medium_term|short_term` — fetches top items; uses mock data if `MOCK=true`
- `POST /api/createPlaylist` — creates a Spotify playlist from supplied URIs; for `type=artists`, resolves each artist's top track URI first

**Pages:**

- `/` — public login landing page (unauthenticated)
- `/dashboard` — top 5 tracks, top 5 artists, and top 5 genres overview (authenticated)
- `/dashboard/tracks` — top 50 tracks with time range selector and playlist creation (authenticated)
- `/dashboard/artists` — top 50 artists with time range selector and playlist creation (authenticated)
- `/dashboard/genres` — top 20 genres as a horizontal bar chart, derived from top 50 artists (authenticated)

**Page structure:** Each authenticated page is split into two files:

- `page.tsx` — async server component, calls `getValidAccessToken()` as auth guard, renders the client component
- `*Client.tsx` — `"use client"` component containing all state, data fetching, and rendering logic (e.g. `DashboardClient.tsx`, `TracksClient.tsx`, `ArtistsClient.tsx`)

**Layouts:**

- `src/app/layout.tsx` — root layout, minimal html/body wrapper with Inter font and dark mode
- `src/app/dashboard/layout.tsx` — dashboard layout, renders the topSify logo header and wraps all `/dashboard/*` pages

**Data flow on `/dashboard/tracks` and `/dashboard/artists`:** All three time ranges (`long_term`, `medium_term`, `short_term`) are fetched in parallel on mount; only `long_term` blocks the loading state. The selected time range switches the displayed data client-side without re-fetching.

**Spotify API wrapper** (`src/lib/spotifyApi.ts`): All direct Spotify API calls live here. Uses `getEnvVariable()` from `src/lib/utils.ts` which throws at startup if any required env var is missing.

**UI components** use shadcn/ui primitives from `src/components/ui/`. Custom components (e.g. `TopTrack`, `TopArtist`, `Top5Card`, `Top50Grid`, `PageHeader`, `CreatePlaylist`, `TopGenresChart`) are in `src/components/`.

**Genre data** is derived client-side from top 50 artists — no separate API endpoint. `TopGenresChart` (dashboard pie) and `GenresClient` (genres page bar chart) both aggregate `artist.genres[]` by frequency. Chart colors use `--chart-1` through `--chart-5` CSS vars (set to sequential green shades in `globals.css`). The `/api/top` endpoint is reused with `type=artists&limit=50`.
