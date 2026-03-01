import { COOKIE_NAMES } from "@/lib/cookies";
import { createAuthURL } from "@/lib/spotifyApi";
import { NextResponse } from "next/server";

// redirect to spotify for authentication with required scopes
export async function GET() {
  const [spotifyAuthUrl, state] = createAuthURL();

  const response = NextResponse.redirect(spotifyAuthUrl);
  response.cookies.set(COOKIE_NAMES.STATE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 300, // 5 minutes
  });

  return response;
}
