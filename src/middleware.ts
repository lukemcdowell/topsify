import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // TODO: remove
  console.log('middleware. from: ', request.url);
  console.log('access_token: ', accessToken);

  if (accessToken) {
    console.log('Access token found, proceeding.');
    return NextResponse.next();
  }

  if (refreshToken) {
    console.log('Refresh token found, attempting to refresh access token.');

    if (request.nextUrl.pathname.startsWith('/api/refresh')) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/api/refresh', request.url));
  }

  console.log('No valid tokens found, redirecting to /continue.');
  return NextResponse.redirect(new URL('/continue', request.url));
}

export const config = {
  matcher: ['/'],
};
