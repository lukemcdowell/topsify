import { spotifyApi } from '@/spotifyApi';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');

  if (!code) {
    // redirect ?
    return new NextResponse('missing requred param "code"');
  }

  const storedState = request.cookies.get('state')?.value;

  if (state === null || state !== storedState) {
    return new NextResponse('error: state mismatch');
  }

  const response = NextResponse.redirect(new URL('/top', request.url));
  response.cookies.delete('state');

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    console.log('access token response: ', accessToken);

    const response = NextResponse.redirect(new URL('/top', request.url));

    response.cookies.delete('state');
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: data.body['expires_in'] * 1000,
    });
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    spotifyApi.setAccessToken(accessToken);

    return response;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return new NextResponse('Error retrieving access token', { status: 500 });
  }
}
