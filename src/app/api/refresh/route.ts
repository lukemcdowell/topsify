import { COOKIE_NAMES } from "@/lib/cookies";
import { requestRefreshedAccessToken } from "@/lib/spotifyApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const storedRefreshToken = request.cookies.get(
    COOKIE_NAMES.REFRESH_TOKEN,
  )?.value;

  if (!storedRefreshToken) {
    console.log("No refresh token found, redirecting to login.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const raw = request.nextUrl.searchParams.get("redirect") || "/dashboard";
  const redirectTo =
    raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  try {
    const [accessToken, refreshToken] =
      await requestRefreshedAccessToken(storedRefreshToken);

    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
    });
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
