# Topsify

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

## Stack

- **Next.js 14** (App Router) — server components for auth guards, client components for data fetching and interactivity
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
