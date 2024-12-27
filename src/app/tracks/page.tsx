'use client';

import PageHeader from '@/components/PageHeader';
import Top50Grid from '@/components/Top50Grid';
import TopTrack from '@/components/TopTrack';
import TopTrackSkeleton from '@/components/TopTrackSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TimeRangeType, TopTrackType } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
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

  const getTrackUris = (tracks: TopTrackType[]) => {
    return tracks.map((track) => track.uri);
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
        console.error(error);
      }
    };

    fetchTopTracks('long_term');
    setLoading(false);

    fetchTopTracks('medium_term');
    fetchTopTracks('short_term');
  }, []);

  if (error)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while fetching your top tracks. Please try again
          later.
        </AlertDescription>
      </Alert>
    );

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        timeRange={selectedTimeRange}
        setTimeRange={setSelectedTimeRange}
        selected="tracks"
        trackUris={getTrackUris(topTracks[selectedTimeRange])}
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
