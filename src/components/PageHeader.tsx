"use client";

import { TimeRangeType } from "@/lib/types";
import GlobalControls from "./GlobalControls";
import Navigation from "./Navigation";

interface PageHeaderProps {
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
  selected: "tracks" | "artists" | "genres";
}

export default function PageHeader({
  timeRange,
  setTimeRange,
  selected,
}: PageHeaderProps) {
  return (
    <div className="container w-full flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 sm:pt-2 px-2 sm:px-0">
      <Navigation selected={selected} />
      <GlobalControls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </div>
  );
}
