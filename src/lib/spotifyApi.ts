import { Buffer } from 'buffer';
import {
  AccessTokenResponse,
  SpotifyItem,
  TimeRangeType,
  TopItemsType,
} from './types';

function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but was not provided.`
    );
  }
  return value;
}

const REDIRECT_URI = getEnvVariable('SPOTIFY_REDIRECT_URI');
const CLIENT_ID = getEnvVariable('SPOTIFY_CLIENT_ID');
const CLIENT_SECRET = getEnvVariable('SPOTIFY_CLIENT_SECRET');

// helper function to prevent CSRF attacks
function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
}

// creates the URL for redirecting to Spotify's authorization page
export function createAuthURL(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    state: generateRandomString(16),
    scope: 'user-top-read',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// requests the initial access and refresh tokens
export async function requestAccessToken(code: string): Promise<string[]> {
  const url = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const headers = {
    Authorization:
      'Basic ' +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error requesting access token: ${response.statusText}`);
    }

    const data: AccessTokenResponse = await response.json();

    return [data.access_token, data.refresh_token];
  } catch (error) {
    console.error('Error requesting access token:', error);
    throw error;
  }
}

// uses the refresh token to request a new access token
export async function requestRefreshedAccessToken(
  refresh_token: string
): Promise<string[]> {
  const url = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
  });

  const headers = {
    Authorization:
      'Basic ' +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error refreshing access token: ${response.statusText}`);
    }

    const data: AccessTokenResponse = await response.json();
    return [data.access_token, data.refresh_token];
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// get top items from spotify API
// TODO: make different func for topTracks v topArtists
// make the api call into a separate func, use in both topTracks and topArtists
export async function getTopItems(
  topItems: TopItemsType,
  time_range: TimeRangeType,
  access_token: string
): Promise<SpotifyItem[]> {
  const url = `https://api.spotify.com/v1/me/top/${topItems}`;
  const params = new URLSearchParams({
    time_range,
    limit: '50',
  });

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error getting top ${topItems}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items as SpotifyItem[];
  } catch (error) {
    console.error(`Error getting top ${topItems}:`, error);
    throw error;
  }
}
