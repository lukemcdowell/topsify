'use client';

import Top5Card from '@/components/Top5Card';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopData = async () => {
      setLoading(true);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading top items</p>;

  return (
    <div className="grid gap-24 grid-cols-1 md:grid-cols-2 pt-16 pb-5">
      <Top5Card itemType="tracks" itemData={topTracks} />
      <Top5Card itemType="artists" itemData={topArtists} />
    </div>
  );
}
