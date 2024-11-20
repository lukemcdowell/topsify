'use client';

import Top5Card from '@/components/Top5Card';
import TopArtist from '@/components/TopArtist';
import TopArtistSkeleton from '@/components/TopArtistSkeleton';
import TopTrack from '@/components/TopTrack';
import TopTrackSkeleton from '@/components/TopTrackSkeleton';
import { TopArtistType, TopTrackType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopData = async () => {
      try {
        const [tracksResponse, artistsResponse] = await Promise.all([
          fetch(`/api/top?type=tracks&limit=5`),
          fetch(`/api/top?type=artists&limit=5`),
        ]);

        const [tracksData, artistsData] = await Promise.all([
          tracksResponse.json(),
          artistsResponse.json(),
        ]);

        if (tracksResponse.ok && artistsResponse.ok) {
          setTopTracks(tracksData);
          setTopArtists(artistsData);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    };

    fetchTopData();
  }, []);

  if (error) return <p>Error loading top items</p>;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="grid gap-16 xs:gap-24 grid-cols-1 md:grid-cols-2 pt-6 xs:pt-16 pb-5">
        <Top5Card itemType="tracks">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopTrackSkeleton key={index} />
              ))
            : topTracks.map((trackData: TopTrackType, index) => (
                <TopTrack key={index} trackData={trackData} />
              ))}
        </Top5Card>
        <Top5Card itemType="artists">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopArtistSkeleton key={index} />
              ))
            : topArtists.map((artistData: TopArtistType, index) => (
                <TopArtist key={index} artistData={artistData} />
              ))}
        </Top5Card>
      </div>
    </div>
  );
}
