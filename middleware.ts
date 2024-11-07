import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(request.url);
  console.log('middleware');

  // check for access token in cookies
  // if none, check for refresh token in cookies, then refresh access token
  // if neither exist or error occurs, authenticate using auth code flow

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/', '/test'],
};
