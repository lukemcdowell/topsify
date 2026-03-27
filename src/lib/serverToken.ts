import { requestRefreshedAccessToken } from "./spotifyApi";
import { getEnvVariable } from "./utils";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getServerAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }
  const refreshToken = getEnvVariable("SPOTIFY_REFRESH_TOKEN");
  const [token] = await requestRefreshedAccessToken(refreshToken);
  cachedToken = token;
  tokenExpiresAt = Date.now() + 3600 * 1000;
  return token;
}
