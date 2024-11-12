'use client';

import TopArtist from '@/components/TopArtist';
import { TopArtistType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topArtists, setTopArtists] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/top?type=artists`);
        const data = await response.json();

        if (response.ok) {
          setTopArtists(data);
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
  if (error) return <p>Error loading top artists</p>;

  return (
    <div className="container flex flex-col justify-center items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-5">
        Your Top Artists
      </h1>
      <div
        id="top-albums"
        className="grid gap-1 md:gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 p-2 mb-24"
      >
        {topArtists.map((artistData: TopArtistType, index) => (
          <TopArtist key={index} artistData={artistData} />
        ))}
      </div>
    </div>
  );
}
