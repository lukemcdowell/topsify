import { Buffer } from "buffer";
import {
  AccessTokenResponse,
  TimeRangeType,
  TopArtistType,
  TopItemType,
  TopTrackType,
} from "./types";
import { getEnvVariable } from "./utils";

const CLIENT_ID = getEnvVariable("SPOTIFY_CLIENT_ID");
const CLIENT_SECRET = getEnvVariable("SPOTIFY_CLIENT_SECRET");

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

