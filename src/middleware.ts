import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log('middleware. from: ', request.url);
  console.log('access_token: ', accessToken);

  // check for access token in cookies
  // if none, check for refresh token in cookies, then refresh access token
  // if neither exist, redirect to login for authentication
  if (accessToken) {
    console.log('access token found');
    return response;
  } else if (refreshToken) {
    console.log('refresh token found');

    // TODO: get new access token from refresh token
    return response;
  } else {
    console.log(
      'no access token found, redirecting to /login for authentication'
    );

    return NextResponse.redirect(new URL('/api/login', request.url));
  }
}

export const config = {
  matcher: ['/top'],
};
