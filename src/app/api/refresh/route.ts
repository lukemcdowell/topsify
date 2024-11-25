import { requestRefreshedAccessToken } from '@/lib/spotifyApi';
import { NextRequest, NextResponse } from 'next/server';

// redirect to spotify for authentication with required scopes
export async function GET(request: NextRequest) {
  const storedRefreshToken = request.cookies.get('refresh_token')?.value;

  if (!storedRefreshToken) {
    console.log('No refresh token found, redirecting to login.');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const [accessToken, refreshToken] = await requestRefreshedAccessToken(
      storedRefreshToken
    );

    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
    });
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
