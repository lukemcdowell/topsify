'use client';

import PageHeader from '@/components/PageHeader';
import Top50Grid from '@/components/Top50Grid';
import TopArtist from '@/components/TopArtist';
import TopArtistSkeleton from '@/components/TopArtistSkeleton';
import { TimeRangeType, TopArtistType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topArtists, setTopArtists] = useState([]);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('long_term');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/top?type=artists&limit=50`);
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

  if (error) return <p>Error loading top artists</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        title="Your top artists"
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      <Top50Grid>
        {loading
          ? Array.from({ length: 50 }).map((_, index) => (
              <TopArtistSkeleton key={index} />
            ))
          : topArtists.map((artistData: TopArtistType, index) => (
              <TopArtist key={index} artistData={artistData} />
            ))}
      </Top50Grid>
    </div>
  );
}
