'use client';

import PageHeader from '@/components/PageHeader';
import Top50Grid from '@/components/Top50Grid';
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

  const pageTitle = 'Your top tracks';
  const playlistButton = () => (
    <Button asChild>
      <Link href="/top">Create playlist</Link>
    </Button>
  );

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/top?type=tracks&limit=50`);
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
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        title={pageTitle}
        playlistButton={playlistButton()}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      <Top50Grid>
        {topTracks.map((trackData: TopTrackType, index) => (
          <TopTrack key={index} trackData={trackData} />
        ))}
      </Top50Grid>
    </div>
  );
}
