'use client';

import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/top')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch top tracks');
        return response.json();
      })
      .then(setTopTracks)
      .then(() => setLoading(true))
      .catch(() => setError(true));
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
