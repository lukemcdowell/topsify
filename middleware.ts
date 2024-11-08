import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  console.log(request.url);
  console.log('middleware');

  // check for access token in cookies
  // if none, check for refresh token in cookies, then refresh access token
  // if neither exist or error occurs, authenticate using auth code flow

  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token');
  const refresh_token = cookieStore.get('access_token');

  const code = request.nextUrl.searchParams.get('code');

  console.log('accesstoken: ', access_token);
  console.log('code: ', code);

  // response.cookies.set('access_token', 'test_token');
  // response.cookies.set('refresh_token', 'test_token');

  // return NextResponse.redirect(new URL('/login', request.url));

  if (access_token) {
    console.log('access token found');
    // TODO: add access token to headers?
    return response;
  } else if (refresh_token) {
    console.log('refresh token found');

    // TODO: get new access token from refresh token
  } else if (code) {
    console.log('authentication code found');
    // TODO: implement authentication code flow
  } else {
    // redirect to Spotify for authentication
    console.log('redirecting to spotify for authentication');

    // TODO: redirect to Spotify
  }

  return response;
}

export const config = {
  matcher: ['/', '/callback'],
};
