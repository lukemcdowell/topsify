"use client";

import PageHeader from "@/components/PageHeader";
import Top50Grid from "@/components/Top50Grid";
import TopArtist from "@/components/TopArtist";
import TopArtistSkeleton from "@/components/TopArtistSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TimeRangeType, TopArtistType } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function ArtistsClient() {
  const [topLongTermArtists, setTopLongTermArtists] = useState([]);
  const [topMediumTermArtists, setTopMediumTermArtists] = useState([]);
  const [topShortTermArtists, setTopShortTermArtists] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRangeType>("long_term");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const topArtists = {
    long_term: topLongTermArtists,
    medium_term: topMediumTermArtists,
    short_term: topShortTermArtists,
  };

  const getArtistUris = (artists: TopArtistType[]) => {
    return artists.map((artists) => artists.uri);
  };

  useEffect(() => {
    const fetchTopArtists = async (timeRange: string) => {
      try {
        const response = await fetch(
          `/api/top?type=artists&limit=50&timeRange=${timeRange}`,
        );
        const data = await response.json();

        if (response.ok) {
          switch (timeRange) {
            case "long_term":
              setTopLongTermArtists(data);
              break;
            case "medium_term":
              setTopMediumTermArtists(data);
              break;
            case "short_term":
              setTopShortTermArtists(data);
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

    fetchTopArtists("long_term");
    setLoading(false);

    fetchTopArtists("medium_term");
    fetchTopArtists("short_term");
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

  return (
    <div className="flex flex-col justify-center items-center">
      <PageHeader
        timeRange={selectedTimeRange}
        setTimeRange={setSelectedTimeRange}
        selected="artists"
        artistUris={getArtistUris(topArtists[selectedTimeRange])}
      />

      <Top50Grid>
        {loading
          ? Array.from({ length: 50 }).map((_, index) => (
              <TopArtistSkeleton key={index} />
            ))
          : topArtists[selectedTimeRange].map(
              (artistData: TopArtistType, index) => (
                <TopArtist key={index} index={index} artistData={artistData} />
              ),
            )}
      </Top50Grid>
    </div>
  );
}
