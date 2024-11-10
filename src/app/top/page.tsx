'use client';

import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/top`);
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
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-10">
        Your Top Tracks
      </h1>
      <ul>
        {topTracks.map((track: any, index) => (
          <li key={index}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
}
