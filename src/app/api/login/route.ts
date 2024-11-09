import { generateRandomString } from '@/lib/utils';
import { spotifyApi } from '@/spotifyApi';
import { NextResponse } from 'next/server';

// redirect to spotify for authentication with required scopes
export async function GET() {
  const scopes = ['user-top-read'];
  const state = generateRandomString(16);

  const spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, state);

  console.log('auth: ', spotifyAuthUrl)

  const response = NextResponse.redirect(spotifyAuthUrl);
  response.cookies.set('state', state, { httpOnly: true, secure: true });

  return response;
}
