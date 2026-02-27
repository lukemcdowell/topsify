"use client";

import { TimeRangeType } from "@/lib/types";
import { ListPlus } from "lucide-react";
import { useState } from "react";
import CreatePlaylist from "./CreatePlaylist";
import GlobalControls from "./GlobalControls";
import Navigation from "./Navigation";
import { Button } from "./ui/button";

interface PageHeaderProps {
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
  selected: "tracks" | "artists";
  trackUris?: string[];
  artistUris?: string[];
}

export default function PageHeader({
  timeRange,
  setTimeRange,
  selected,
  trackUris,
  artistUris,
}: PageHeaderProps) {
  const timeRangeMapping = {
    short_term: "Short-term",
    medium_term: "Medium-term",
    long_term: "Long-term",
  };
  const defaultPlaylistName = `My ${timeRangeMapping[
    timeRange
  ].toLowerCase()} top ${selected === "tracks" ? "tracks" : "artists"}`;
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);

  return (
    <>
      <div className="container w-full flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 sm:pt-2 px-2 sm:px-0">
        <Navigation selected={selected} />
        <GlobalControls timeRange={timeRange} setTimeRange={setTimeRange}>
          <Button
            onClick={() => setIsPlaylistDialogOpen(true)}
            aria-label="Create playlist"
          >
            <span className="hidden sm:inline">Create playlist</span>
            <ListPlus />
          </Button>
        </GlobalControls>
      </div>

      <CreatePlaylist
        isDialogOpen={isPlaylistDialogOpen}
        setIsDialogOpen={setIsPlaylistDialogOpen}
        selected={selected}
        timeRange={timeRange}
        trackUris={trackUris}
        artistUris={artistUris}
        defaultPlaylistName={defaultPlaylistName}
      />
    </>
  );
}
