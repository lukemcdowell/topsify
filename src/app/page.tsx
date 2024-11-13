'use client';

import Top5Card from '@/components/Top5Card';
import { useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: get top 5 tracks and artists and dispaly together
  // useEffect(() => {
  //   const fetchTopTracks = async () => {
  //     try {
  //       const response = await fetch(`/api/top`);
  //       const data = await response.json();

  //       if (response.ok) {
  //         setTopTracks(data);
  //       } else {
  //         setError(true);
  //       }
  //     } catch (error) {
  //       setError(true);
  //     }

  //     setLoading(false);
  //   };

  //   fetchTopTracks();
  // }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading top items</p>;

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 py-5">
      <Top5Card itemType="tracks" />
      <Top5Card itemType="artists" />
    </div>
  );
}
