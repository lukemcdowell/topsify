import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TimeRangeType } from '@/lib/types';
import { ChevronDown, Plus } from 'lucide-react';
import Navigation from './Navigation';
import { Button } from './ui/button';

interface PageHeaderProps {
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
  selected: 'tracks' | 'artists';
}

export default function PageHeader({
  timeRange,
  setTimeRange,
  selected,
}: PageHeaderProps) {
  const timeRangeMapping = {
    short_term: 'Last 4 weeks',
    medium_term: 'Last 6 months',
    long_term: 'Last 12 months',
  };

  return (
    <>
      <div className="container w-full flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 sm:pt-2">
        <Navigation selected={selected} />
        <div className="flex gap-2 justify-center items-center w-full sm:w-auto px-2 sm:px-0">
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
          <Button>
            Create playlist <Plus />
          </Button>
        </div>
      </div>
    </>
  );
}
