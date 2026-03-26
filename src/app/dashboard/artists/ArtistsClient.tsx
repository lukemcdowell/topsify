"use client";

import PageHeader from "@/components/PageHeader";
import Top50Grid from "@/components/Top50Grid";
import TopArtist from "@/components/TopArtist";
import TopArtistSkeleton from "@/components/TopArtistSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TimeRangeType, TopArtistType } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const TIME_RANGES: TimeRangeType[] = ["long_term", "medium_term", "short_term"];

export default function ArtistsClient() {
  const [artists, setArtists] = useState<
    Record<TimeRangeType, TopArtistType[]>
  >({
    long_term: [],
    medium_term: [],
    short_term: [],
  });
  const [loadedRanges, setLoadedRanges] = useState<Set<TimeRangeType>>(
    new Set(),
  );
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRangeType>("long_term");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRange = async (timeRange: TimeRangeType) => {
      try {
        const response = await fetch(
          `/api/top?type=artists&limit=50&timeRange=${timeRange}`,
        );
        const data = await response.json();

        if (response.ok) {
          setArtists((prev) => ({ ...prev, [timeRange]: data }));
          setLoadedRanges((prev) => new Set(prev).add(timeRange));
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    };

    TIME_RANGES.forEach((r) => fetchRange(r));
  }, []);

  if (error)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while fetching your top artists. Please try again
          later.
        </AlertDescription>
      </Alert>
    );

  const isLoaded = loadedRanges.has(selectedTimeRange);

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        timeRange={selectedTimeRange}
        setTimeRange={setSelectedTimeRange}
        selected="artists"
      />

      <Top50Grid>
        {isLoaded
          ? artists[selectedTimeRange].map((artistData, index) => (
              <TopArtist
                key={artistData.uri}
                index={index}
                artistData={artistData}
              />
            ))
          : Array.from({ length: 50 }).map((_, index) => (
              <TopArtistSkeleton key={index} />
            ))}
      </Top50Grid>
    </div>
  );
}
