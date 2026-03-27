"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TopArtistType } from "@/lib/types";
import { Pie, PieChart } from "recharts";

interface TopGenresChartProps {
  artists: TopArtistType[];
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function getTopGenres(artists: TopArtistType[], topN = 5) {
  const counts: Record<string, number> = {};
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}

function renderLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  name: string;
}) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
      fontWeight={500}
    >
      {name}
    </text>
  );
}

export default function TopGenresChart({ artists }: TopGenresChartProps) {
  const topGenres = getTopGenres(artists);

  const chartData = topGenres.map(([genre, count], i) => ({
    genre,
    count,
    fill: CHART_COLORS[i],
  }));

  const chartConfig = Object.fromEntries(
    topGenres.map(([genre], i) => [
      genre,
      { label: genre, color: CHART_COLORS[i] },
    ]),
  ) satisfies ChartConfig;

  if (topGenres.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No genre data available.
      </p>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto h-[400px] w-full"
    >
      <PieChart margin={{ top: 24, right: 48, bottom: 24, left: 48 }}>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="genre" hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="genre"
          outerRadius="60%"
          label={renderLabel}
          labelLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
        />
      </PieChart>
    </ChartContainer>
  );
}
