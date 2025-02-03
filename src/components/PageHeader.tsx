'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TimeRangeType } from '@/lib/types';
import { ChevronDown, Info, Plus } from 'lucide-react';
import { useState } from 'react';
import CreatePlaylist from './CreatePlaylist';
import Information from './Information';
import Navigation from './Navigation';
import { Button } from './ui/button';

interface PageHeaderProps {
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
  selected: 'tracks' | 'artists';
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
    short_term: 'Short-term',
    medium_term: 'Medium-term',
    long_term: 'Long-term',
  };
  const defaultPlaylistName = `My ${timeRangeMapping[
    timeRange
  ].toLowerCase()} top ${selected === 'tracks' ? 'tracks' : 'artists'}`;
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsPlaylistDialogOpen(true);
  };

  return (
    <>
      <div className="container w-full flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 sm:pt-2">
        <Navigation selected={selected} />
        <div className="flex gap-2 justify-center items-center w-full sm:w-auto px-2 sm:px-0">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsInfoDialogOpen(true)}
                  aria-label="about & how to use"
                >
                  <Info />
                </Button>
              </TooltipTrigger>
              <TooltipContent>About & How to Use</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {timeRangeMapping[timeRange]}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
              <DropdownMenuRadioGroup
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as TimeRangeType)}
              >
                <DropdownMenuRadioItem value="short_term">
                  {timeRangeMapping['short_term']}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium_term">
                  {timeRangeMapping['medium_term']}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="long_term">
                  {timeRangeMapping['long_term']}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleDialogOpen}>
            Create playlist <Plus />
          </Button>
        </div>
      </div>

      <CreatePlaylist
        isDialogOpen={isPlaylistDialogOpen}
        setIsDialogOpen={setIsPlaylistDialogOpen}
        selected={selected}
        trackUris={trackUris}
        artistUris={artistUris}
        defaultPlaylistName={defaultPlaylistName}
      />

      <Information isOpen={isInfoDialogOpen} setIsOpen={setIsInfoDialogOpen} />
    </>
  );
}
