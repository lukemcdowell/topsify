import { requestRefreshedAccessToken } from '@/lib/spotifyApi';
import { NextRequest, NextResponse } from 'next/server';

// redirect to spotify for authentication with required scopes
export async function GET(request: NextRequest) {
  const storedRefreshToken = request.cookies.get('refresh_token')?.value;

  if (!storedRefreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const [accessToken, refreshToken] = await requestRefreshedAccessToken(
    storedRefreshToken
  );

  const response = NextResponse.redirect(new URL('/top', request.url));
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 3600 * 1000,
  });
  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
  });

  return response;
}
