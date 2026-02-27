import { createAuthURL } from "@/lib/spotifyApi";
import { NextResponse } from "next/server";

// redirect to spotify for authentication with required scopes
export async function GET() {
  const [spotifyAuthUrl, state] = createAuthURL();

  const response = NextResponse.redirect(spotifyAuthUrl);
  response.cookies.set("state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
