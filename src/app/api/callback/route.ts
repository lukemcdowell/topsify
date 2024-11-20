import { requestAccessToken } from '@/lib/spotifyApi';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');

  const storedState = request.cookies.get('state')?.value;

  if (state === null || state !== storedState) {
    return new NextResponse('Error: CSRF state mismatch', { status: 500 });
  }
  if (!code) {
    return new NextResponse('Error: no code in callback', { status: 500 });
  }

  try {
    const [accessToken, refreshToken] = await requestAccessToken(code);

    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('state');
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600,
    });
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return response;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return new NextResponse('Error retrieving access token', { status: 500 });
  }
}
