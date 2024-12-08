'use client';

import PageHeader from '@/components/PageHeader';
import Top50Grid from '@/components/Top50Grid';
import TopTrack from '@/components/TopTrack';
import TopTrackSkeleton from '@/components/TopTrackSkeleton';
import { TimeRangeType, TopTrackType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topLongTermTracks, setTopLongTermTracks] = useState([]);
  const [topMediumTermTracks, setTopMediumTermTracks] = useState([]);
  const [topShortTermTracks, setTopShortTermTracks] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRangeType>('long_term');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const topTracks = {
    long_term: topLongTermTracks,
    medium_term: topMediumTermTracks,
    short_term: topShortTermTracks,
  };

  useEffect(() => {
    const fetchTopTracks = async (timeRange: string) => {
      try {
        const response = await fetch(
          `/api/top?type=tracks&limit=50&timeRange=${timeRange}`
        );
        const data = await response.json();

        if (response.ok) {
          switch (timeRange) {
            case 'long_term':
              setTopLongTermTracks(data);
              break;
            case 'medium_term':
              setTopMediumTermTracks(data);
              break;
            case 'short_term':
              setTopShortTermTracks(data);
              break;
          }
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    };

    fetchTopTracks('long_term');
    setLoading(false);

    fetchTopTracks('medium_term');
    fetchTopTracks('short_term');
  }, []);

  if (error) return <p>Error loading top tracks</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        timeRange={selectedTimeRange}
        setTimeRange={setSelectedTimeRange}
        selected="tracks"
      />

      <Top50Grid>
        {loading
          ? Array.from({ length: 50 }).map((_, index) => (
              <TopTrackSkeleton key={index} />
            ))
          : topTracks[selectedTimeRange].map(
              (trackData: TopTrackType, index) => (
                <TopTrack key={index} index={index} trackData={trackData} />
              )
            )}
      </Top50Grid>
    </div>
  );
}
