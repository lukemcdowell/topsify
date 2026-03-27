# topSify

View your top Spotify tracks and artists across different time ranges, and create playlists from them.

## Features

- Top 5 tracks and artists overview on the dashboard
- Full top 50 tracks and artists with short / medium / long-term time ranges
- Create a Spotify playlist directly from any top-50 list
- Spotify OAuth 2.0 authentication with token refresh

## Running locally

**Prerequisites:** Node.js, a [Spotify Developer app](https://developer.spotify.com/dashboard) with `http://127.0.0.1:3000/api/callback` added as a redirect URI.

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local`:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/callback
   ```

   > Tip: set `MOCK=true` to use mock data without a real Spotify connection.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://127.0.0.1:3000](http://127.0.0.1:3000) — use `127.0.0.1`, not `localhost` (required for the Spotify OAuth redirect to work).

## Running tests

### Unit and component tests

Uses [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/). No environment setup required.

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

Covers: lib utilities, Spotify API wrapper, auth logic, middleware, all API route handlers, and all client components.

### E2E tests

Uses [Playwright](https://playwright.dev/). Requires Playwright browsers to be installed (one-time setup):

```bash
npx playwright install
```

Then run:

```bash
npm run test:e2e
```

The E2E suite starts the dev server with `MOCK=true` automatically, so no `.env.local` or Spotify credentials are needed. Auth is simulated by injecting cookies directly — no real OAuth flow.

## Stack

- **Next.js 16** (App Router) — server components for auth guards, client components for data fetching and interactivity
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (zinc, dark mode only)
- **Spotify Web API** — top items, playlist creation

## Project structure

```
src/
  app/
    api/              # Route handlers: login, callback, refresh, logout, top, createPlaylist
    dashboard/        # Authenticated pages (overview, /tracks, /artists)
    page.tsx          # Public login landing page
  components/         # Shared UI components (PageHeader, Top5Card, Top50Grid, etc.)
  lib/                # Auth helpers, Spotify API wrapper, types, cookies
  mock/               # Mock data for local development (MOCK=true)
```

Auth is handled via httpOnly cookies (`access_token`, `refresh_token`). Middleware at `src/proxy.ts` handles redirects for unauthenticated and already-authenticated users.
