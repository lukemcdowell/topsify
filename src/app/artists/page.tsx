'use client';

import PageHeader from '@/components/PageHeader';
import Top50Grid from '@/components/Top50Grid';
import TopArtist from '@/components/TopArtist';
import { Button } from '@/components/ui/button';
import { TimeRangeType, TopArtistType } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TopTracks() {
  const [topArtists, setTopArtists] = useState([]);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('long_term');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const pageTitle = 'Your top artists';
  const playlistButton = () => <Button>Create playlist</Button>;

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`/api/top?type=artists`);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading top artists</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        title={pageTitle}
        playlistButton={playlistButton()}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      <Top50Grid>
        {topArtists.map((artistData: TopArtistType, index) => (
          <TopArtist key={index} artistData={artistData} />
        ))}
      </Top50Grid>
    </div>
  );
}
