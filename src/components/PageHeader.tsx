import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TimeRangeType } from '@/lib/types';
import React from 'react';
import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  playlistButton: React.ReactNode;
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
}

export default function PageHeader({
  title,
  playlistButton,
  timeRange,
  setTimeRange,
}: PageHeaderProps) {
  const timeRangeMapping = {
    short_term: 'Last 4 weeks',
    medium_term: 'Last 6 months',
    long_term: 'Last 12 months',
  };

  return (
    <div className="container flex justify-between items-center gap-2 py-4 px-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {title}
      </h1>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{`Time range: ${timeRangeMapping[timeRange]}`}</Button>
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
        {playlistButton}
      </div>
    </div>
  );
}
