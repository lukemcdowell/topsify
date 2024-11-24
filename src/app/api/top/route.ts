import { getTopArtists, getTopTracks } from '@/lib/spotifyApi';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const type = request.nextUrl.searchParams.get('type');
  const limit = request.nextUrl.searchParams.get('limit');
  const timeRange = request.nextUrl.searchParams.get('timeRange');

  if (!accessToken) {
    return NextResponse.redirect(new URL('/api/login', request.url));
  }

  if (type !== 'tracks' && type !== 'artists') {
    return new NextResponse('Error: no valid type specified in params', {
      status: 500,
    });
  }

  if (!limit) {
    return new NextResponse('Error: no valid limit specified in params', {
      status: 500,
    });
  }

  if (
    timeRange !== 'long_term' &&
    timeRange !== 'medium_term' &&
    timeRange !== 'short_term'
  ) {
    return new NextResponse('Error: no valid time range specified in params', {
      status: 500,
    });
  }

  let items;
  if (type === 'tracks') {
    items = await getTopTracks(timeRange, Number(limit), accessToken);
  } else {
    items = await getTopArtists(timeRange, Number(limit), accessToken);
  }

  return NextResponse.json(items);
}
