"use client";

import GlobalControls from "@/components/GlobalControls";
import Top5Card from "@/components/Top5Card";
import TopArtist from "@/components/TopArtist";
import TopArtistSkeleton from "@/components/TopArtistSkeleton";
import TopTrack from "@/components/TopTrack";
import TopTrackSkeleton from "@/components/TopTrackSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TimeRangeType, TopArtistType, TopTrackType } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  const [topTracks, setTopTracks] = useState<TopTrackType[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtistType[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRangeType>("long_term");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopData = async () => {
      setLoading(true);
      try {
        const [tracksResponse, artistsResponse] = await Promise.all([
          fetch(`/api/top?type=tracks&limit=5&timeRange=${timeRange}`),
          fetch(`/api/top?type=artists&limit=5&timeRange=${timeRange}`),
        ]);

        const [tracksData, artistsData] = await Promise.all([
          tracksResponse.json(),
          artistsResponse.json(),
        ]);

        if (tracksResponse.ok && artistsResponse.ok) {
          setTopTracks(tracksData);
          setTopArtists(artistsData);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.error(error);
      }

      setLoading(false);
    };

    fetchTopData();
  }, [timeRange]);

  if (error)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while fetching your top tracks and artists. Please
          try again later.
        </AlertDescription>
      </Alert>
    );

  return (
    <div className="flex flex-col items-center">
      <div className="container w-full flex justify-end pt-4 sm:pt-2 pb-2 px-2 sm:px-0">
        <GlobalControls timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>
      <div className="w-full grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 pb-5 px-2 sm:px-0">
        <Top5Card itemType="tracks">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopTrackSkeleton key={index} />
              ))
            : topTracks.map((trackData, index) => (
                <TopTrack
                  key={trackData.uri}
                  index={index}
                  trackData={trackData}
                />
              ))}
        </Top5Card>
        <Top5Card itemType="artists">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopArtistSkeleton key={index} />
              ))
            : topArtists.map((artistData, index) => (
                <TopArtist
                  key={artistData.uri}
                  index={index}
                  artistData={artistData}
                />
              ))}
        </Top5Card>
      </div>
    </div>
  );
}
