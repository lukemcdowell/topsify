import { getTopArtists, getTopTracks } from '@/lib/spotifyApi';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

async function loadMockData(type: string) {
  const mockDataPath = path.join(
    process.cwd(),
    type === 'tracks'
      ? '/src/mock/mockTopTracks.json'
      : '/src/mock/mockTopArists.json'
  );
  const mockData = await fs.readFile(mockDataPath, 'utf8');
  return JSON.parse(mockData);
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const type = request.nextUrl.searchParams.get('type');
  const limit = request.nextUrl.searchParams.get('limit');
  const timeRange = request.nextUrl.searchParams.get('timeRange');

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

  if (process.env.MOCK && process.env.MOCK === 'true') {
    console.log('Environment variable MOCK set to true: using mock data');
    const mockData = await loadMockData(type);
    return NextResponse.json(mockData.slice(0, Number(limit)));
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/api/login', request.url));
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

  try {
    let items;
    if (type === 'tracks') {
      items = await getTopTracks(timeRange, Number(limit), accessToken);
    } else {
      items = await getTopArtists(timeRange, Number(limit), accessToken);
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error getting top items:', error);
    return new NextResponse('Error getting top items', { status: 500 });
  }
}
