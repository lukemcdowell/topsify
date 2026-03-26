"use client";

import { TimeRangeType } from "@/lib/types";
import { useState } from "react";
import CreatePlaylist from "./CreatePlaylist";
import GlobalControls from "./GlobalControls";
import Navigation from "./Navigation";

interface PageHeaderProps {
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
  selected: "tracks" | "artists";
  trackUris?: string[];
}

export default function PageHeader({
  timeRange,
  setTimeRange,
  selected,
  trackUris,
}: PageHeaderProps) {
  const timeRangeMapping = {
    short_term: "Short-term",
    medium_term: "Medium-term",
    long_term: "Long-term",
  };
  const defaultPlaylistName = `My ${timeRangeMapping[timeRange].toLowerCase()} top tracks`;
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);

  return (
    <>
      <div className="container w-full flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 sm:pt-2 px-2 sm:px-0">
        <Navigation selected={selected} />
        <GlobalControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          onCreatePlaylist={selected === "tracks" ? () => setIsPlaylistDialogOpen(true) : undefined}
        />
      </div>

      <CreatePlaylist
        isDialogOpen={isPlaylistDialogOpen}
        setIsDialogOpen={setIsPlaylistDialogOpen}
        timeRange={timeRange}
        trackUris={trackUris}
        defaultPlaylistName={defaultPlaylistName}
      />
    </>
  );
}
