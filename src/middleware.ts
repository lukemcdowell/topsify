import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log('middleware. from: ', request.url);
  console.log('access_token: ', accessToken);

  // check for access token in cookies, if there is one, redirect to /top
  // if none, check for refresh token in cookies, then refresh access token
  // if neither exist, redirect to login for authentication
  if (accessToken) {
    console.log('access token found');

    return NextResponse.next();
  } else if (refreshToken) {
    console.log('refresh token found');

    return NextResponse.redirect(new URL('/api/refresh', request.url));
  } else {
    console.log(
      'no access or refresh token found, redirecting to /login for authentication'
    );

    return NextResponse.redirect(new URL('/api/login', request.url));
  }
}

export const config = {
  matcher: ['/top'],
};
