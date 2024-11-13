'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
    <div className="flex flex-col justify-center items-center gap-2">
      <Button asChild>
        <Link href="/tracks">View all top tracks</Link>
      </Button>
      <Button asChild>
        <Link href="/artists">View all top artists</Link>
      </Button>
    </div>
  );
}
