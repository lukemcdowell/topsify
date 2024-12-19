import {
  addTracksToPlaylist,
  createPlaylist,
  getUserId,
} from '@/lib/spotifyApi';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const { playlistName, isPublic, trackUris } = await request.json();

  if (!accessToken) {
    return NextResponse.redirect(new URL('/api/login', request.url));
  }

  if (!trackUris || trackUris.length === 0) {
    return new NextResponse('Error: trackUris supplied', {
      status: 400,
    });
  }

  try {
    const userId = await getUserId(accessToken);

    const playlistId = await createPlaylist(
      userId,
      playlistName,
      isPublic,
      accessToken
    );

    await addTracksToPlaylist(playlistId, trackUris, accessToken);
    return new NextResponse(JSON.stringify({ playlistId }), { status: 201 });
  } catch (error) {
    console.error('Error creating playlist:', error);
    return new NextResponse('Error creating playlist', {
      status: 500,
    });
  }
}
