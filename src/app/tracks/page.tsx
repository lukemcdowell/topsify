'use client';

import PageHeader from '@/components/PageHeader';
import Top50Grid from '@/components/Top50Grid';
import TopTrack from '@/components/TopTrack';
import TopTrackSkeleton from '@/components/TopTrackSkeleton';
import { TimeRangeType, TopTrackType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('long_term');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `/api/top?type=tracks&limit=50&timeRange=${timeRange}`
        );
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
  }, [timeRange]);

  if (error) return <p>Error loading top tracks</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        title="Your top tracks"
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      <Top50Grid>
        {loading
          ? Array.from({ length: 50 }).map((_, index) => (
              <TopTrackSkeleton key={index} />
            ))
          : topTracks.map((trackData: TopTrackType, index) => (
              <TopTrack key={index} index={index} trackData={trackData} />
            ))}
      </Top50Grid>
    </div>
  );
}
