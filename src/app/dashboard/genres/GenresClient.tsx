"use client";

import PageHeader from "@/components/PageHeader";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TimeRangeType, TopArtistType } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

const TIME_RANGES: TimeRangeType[] = ["long_term", "medium_term", "short_term"];

const chartConfig = {
  count: { label: "Artists", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

function getTopGenres(artists: TopArtistType[], topN = 20) {
  const counts: Record<string, number> = {};
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([genre, count]) => ({ genre, count }));
}

export default function GenresClient() {
  const [artists, setArtists] = useState<Record<TimeRangeType, TopArtistType[]>>(
    { long_term: [], medium_term: [], short_term: [] },
  );
  const [loadedRanges, setLoadedRanges] = useState<Set<TimeRangeType>>(new Set());
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>("long_term");
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
          An error occurred while fetching your top genres. Please try again later.
        </AlertDescription>
      </Alert>
    );

  const isLoaded = loadedRanges.has(selectedTimeRange);
  const chartData = getTopGenres(artists[selectedTimeRange]);

  return (
    <div className="flex flex-col justify-center items-center pb-8">
      <PageHeader
        timeRange={selectedTimeRange}
        setTimeRange={setSelectedTimeRange}
        selected="genres"
      />

      <div className="container w-full mt-6 px-2 sm:px-0">
        {!isLoaded ? (
          <Skeleton className="h-[560px] w-full rounded-lg" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[560px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-white">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 48, bottom: 0, left: 8 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="genre"
                width={148}
                tick={{ fontSize: 14, fill: "#ffffff" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) =>
                  value.length > 22 ? value.slice(0, 22) + "…" : value
                }
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={<ChartTooltipContent nameKey="genre" hideLabel />}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: "#ffffff", fontSize: 14, fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
