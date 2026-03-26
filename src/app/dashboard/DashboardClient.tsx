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

const TIME_RANGES: TimeRangeType[] = ["long_term", "medium_term", "short_term"];

const emptyRecord = <T,>(): Record<TimeRangeType, T[]> => ({
  long_term: [],
  medium_term: [],
  short_term: [],
});

export default function DashboardClient() {
  const [tracks, setTracks] = useState<Record<TimeRangeType, TopTrackType[]>>(emptyRecord());
  const [artists, setArtists] = useState<Record<TimeRangeType, TopArtistType[]>>(emptyRecord());
  const [loadedRanges, setLoadedRanges] = useState<Set<TimeRangeType>>(new Set());
  const [timeRange, setTimeRange] = useState<TimeRangeType>("long_term");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRange = async (range: TimeRangeType) => {
      try {
        const [tracksResponse, artistsResponse] = await Promise.all([
          fetch(`/api/top?type=tracks&limit=5&timeRange=${range}`),
          fetch(`/api/top?type=artists&limit=5&timeRange=${range}`),
        ]);

        if (!tracksResponse.ok || !artistsResponse.ok) {
          setError(true);
          return;
        }

        const [tracksData, artistsData] = await Promise.all([
          tracksResponse.json(),
          artistsResponse.json(),
        ]);

        setTracks((prev) => ({ ...prev, [range]: tracksData }));
        setArtists((prev) => ({ ...prev, [range]: artistsData }));
        setLoadedRanges((prev) => new Set(prev).add(range));
      } catch (err) {
        setError(true);
        console.error(err);
      }
    };

    TIME_RANGES.forEach((r) => fetchRange(r));
  }, []);

  const isLoaded = loadedRanges.has(timeRange);

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
      <div className="container w-full lg:w-2/3 flex justify-end pt-4 sm:pt-2 pb-2 px-2 sm:px-0">
        <GlobalControls timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>
      {/* TODO: what width should these be? how to display header? */}
      <div className="w-full lg:w-2/3 grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 pb-5 px-2 sm:px-0">
        <Top5Card itemType="tracks">
          {!isLoaded
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopTrackSkeleton key={index} />
              ))
            : tracks[timeRange].map((trackData, index) => (
                <TopTrack
                  key={trackData.uri}
                  index={index}
                  trackData={trackData}
                />
              ))}
        </Top5Card>
        <Top5Card itemType="artists">
          {!isLoaded
            ? Array.from({ length: 5 }).map((_, index) => (
                <TopArtistSkeleton key={index} />
              ))
            : artists[timeRange].map((artistData, index) => (
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
