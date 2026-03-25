import { COOKIE_NAMES } from "@/lib/cookies";
import { requestAccessToken } from "@/lib/spotifyApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const storedState = request.cookies.get(COOKIE_NAMES.STATE)?.value;

  if (state === null || state !== storedState) {
    return new NextResponse("Error: CSRF state mismatch", { status: 403 });
  }
  if (!code) {
    return new NextResponse("Error: no code in callback", { status: 400 });
  }

  try {
    const [accessToken, refreshToken] = await requestAccessToken(code);

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.delete(COOKIE_NAMES.STATE);
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600, // 1 hour
    });
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
    return new NextResponse("Error retrieving access token", { status: 500 });
  }
}
