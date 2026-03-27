import { Buffer } from "buffer";
import {
  AccessTokenResponse,
  TimeRangeType,
  TopArtistType,
  TopItemType,
  TopTrackType,
} from "./types";
import { getEnvVariable } from "./utils";

const REDIRECT_URI = getEnvVariable("SPOTIFY_REDIRECT_URI");
const CLIENT_ID = getEnvVariable("SPOTIFY_CLIENT_ID");
const CLIENT_SECRET = getEnvVariable("SPOTIFY_CLIENT_SECRET");

// helper function to prevent CSRF attacks
function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");
}

// creates the URL for redirecting to Spotify's authorization page
export function createAuthURL(): string[] {
  const state = generateRandomString(16);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    state,
    scope: "user-top-read",
  });

  return [`https://accounts.spotify.com/authorize?${params.toString()}`, state];
}

// requests the initial access and refresh tokens
export async function requestAccessToken(code: string): Promise<string[]> {
  const url = "https://accounts.spotify.com/api/token";
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const headers = {
    Authorization:
      "Basic " +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error requesting access token: ${response.statusText}`);
    }

    const data: AccessTokenResponse = await response.json();

    if (!data.refresh_token) {
      throw new Error(`Error: refresh token is undefined`);
    }

    return [data.access_token, data.refresh_token];
  } catch (error) {
    console.error("Error requesting access token:", error);
    throw error;
  }
}

// uses the refresh token to request a new access token
export async function requestRefreshedAccessToken(
  refresh_token: string,
): Promise<string[]> {
  const url = "https://accounts.spotify.com/api/token";
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });

  const headers = {
    Authorization:
      "Basic " +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error refreshing access token: ${response.statusText}`);
    }

    const data: AccessTokenResponse = await response.json();
    return [data.access_token, data.refresh_token ?? refresh_token];
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

// get top items from spotify API
async function fetchTopItems<T>(
  itemType: TopItemType,
  timeRange: TimeRangeType,
  limit: number,
  accessToken: string,
): Promise<T[]> {
  const url = `https://api.spotify.com/v1/me/top/${itemType}`;
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: String(limit),
  });

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error getting top ${itemType}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items as T[];
  } catch (error) {
    console.error(`Error getting top ${itemType}:`, error);
    throw error;
  }
}

export async function getTopTracks(
  timeRange: TimeRangeType,
  limit: number,
  accessToken: string,
): Promise<TopTrackType[]> {
  return fetchTopItems<TopTrackType>("tracks", timeRange, limit, accessToken);
}

export async function getTopArtists(
  timeRange: TimeRangeType,
  limit: number,
  accessToken: string,
): Promise<TopArtistType[]> {
  return fetchTopItems<TopArtistType>("artists", timeRange, limit, accessToken);
}

