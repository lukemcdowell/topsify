import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refresh_token");

  if (pathname === "/dashboard" && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/tracks", "/dashboard/artists", "/dashboard/genres", "/"],
};
