'use client';

import TopTrack from '@/components/TopTrack';
import { TopTrackType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/top?type=tracks`);
        const data = await response.json();

        if (response.ok) {
          setTopTracks(data);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    };

    fetchTopTracks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading top tracks</p>;

  return (
    <div className="container flex flex-col justify-center items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-5">
        Your Top Tracks
      </h1>
      <div
        id="top-tracks"
        className="grid gap-1 md:gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 p-2 mb-24"
      >
        {topTracks.map((trackData: TopTrackType, index) => (
          <TopTrack key={index} trackData={trackData} />
        ))}
      </div>
    </div>
  );
}
