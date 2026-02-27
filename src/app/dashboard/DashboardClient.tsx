"use client";

import Top5Card from "@/components/Top5Card";
import TopArtist from "@/components/TopArtist";
import TopArtistSkeleton from "@/components/TopArtistSkeleton";
import TopTrack from "@/components/TopTrack";
import TopTrackSkeleton from "@/components/TopTrackSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TopArtistType, TopTrackType } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopData = async () => {
      try {
        const [tracksResponse, artistsResponse] = await Promise.all([
          fetch(`/api/top?type=tracks&limit=5&timeRange=long_term`),
          fetch(`/api/top?type=artists&limit=5&timeRange=long_term`),
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
  }, []);

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
    <div className="flex flex-col pt-4 items-center h-full">
      <div className="flex flex-col gap-2 pb-2">
        <p className="scroll-m-20 text-xl font-semibold tracking-tight text-center px-5 sm:px-0 pb-2">
          Your top tracks and artists, all in one place
        </p>
      </div>
      <div className="grid gap-2 sm:gap-16 grid-cols-1 sm:grid-cols-2 pb-5">
        <Top5Card itemType="tracks">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopTrackSkeleton key={index} />
              ))
            : topTracks.map((trackData: TopTrackType, index) => (
                <TopTrack key={index} index={index} trackData={trackData} />
              ))}
        </Top5Card>
        <Top5Card itemType="artists">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopArtistSkeleton key={index} />
              ))
            : topArtists.map((artistData: TopArtistType, index) => (
                <TopArtist key={index} index={index} artistData={artistData} />
              ))}
        </Top5Card>
      </div>
    </div>
  );
}
