# topSify

A read-only showcase of my top Spotify tracks, artists, and genres across different time ranges.

> **Note:** This was originally built to let anyone view their own top Spotify data. Spotify restricted API access to approved apps after it was built, so it now only displays my listening history. You can still run your own instance - see below.

## Features

- Top 5 tracks, artists, and genres overview on the dashboard
- Full top 50 tracks and artists with short / medium / long-term time ranges
- Top 20 genres as a bar chart, derived from top 50 artists

## Running your own instance

**Prerequisites:** Node.js, a [Spotify Developer app](https://developer.spotify.com/dashboard), and a Spotify refresh token for your account (obtained via a [one-time OAuth flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)).

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local`:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

   > Tip: set `MOCK=true` to use mock data without a Spotify connection.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Running tests

### Unit and component tests

Uses [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/). No environment setup required.

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

Covers: lib utilities, Spotify API wrapper, all API route handlers, and all client components.

### E2E tests

Uses [Playwright](https://playwright.dev/). Requires Playwright browsers to be installed (one-time setup):

```bash
npx playwright install
```

Then run:

```bash
npm run test:e2e
```

The E2E suite starts the dev server with `MOCK=true` automatically, so no `.env.local` or Spotify credentials are needed.

## Stack

- **Next.js 16** (App Router) — server components, client components for data fetching and interactivity
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (zinc, dark mode only)
- **Spotify Web API** — top items endpoint, server-side token refresh via `SPOTIFY_REFRESH_TOKEN`

## Project structure

```
src/
  app/
    api/
      top/          # Route handler: fetch top tracks or artists
    dashboard/      # Pages: overview, /tracks, /artists, /genres
    page.tsx        # Redirects to /dashboard
  components/       # Shared UI components (PageHeader, Top5Card, Top50Grid, etc.)
  lib/              # Spotify API wrapper, server token helper, types, utils
  mock/             # Mock data for local development (MOCK=true)
```
