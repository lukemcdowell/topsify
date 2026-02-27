import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (refreshToken) {
    if (request.nextUrl.pathname.startsWith("/api/refresh")) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/api/refresh", request.url));
  }

  return NextResponse.redirect(new URL("/continue", request.url));
}

export const config = {
  matcher: ["/", "/tracks", "/artists"],
};
