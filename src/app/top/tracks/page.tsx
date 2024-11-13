'use client';

import PageHeader from '@/components/PageHeader';
import TopTrack from '@/components/TopTrack';
import { Button } from '@/components/ui/button';
import { TimeRangeType, TopTrackType } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('long_term');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const pageTitle = 'Your Top Tracks';
  const playlistButton = () => (
    <Button asChild>
      <Link href="/top">Create playlist</Link>
    </Button>
  );

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
      <PageHeader
        title={pageTitle}
        playlistButton={playlistButton()}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

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
