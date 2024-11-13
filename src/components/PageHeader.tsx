import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TimeRangeType } from '@/lib/types';
import { Plus } from 'lucide-react';
import Navigation from './Navigation';
import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  timeRange: TimeRangeType;
  setTimeRange: (newTimeRange: TimeRangeType) => void;
}

export default function PageHeader({
  title,
  timeRange,
  setTimeRange,
}: PageHeaderProps) {
  const timeRangeMapping = {
    short_term: 'Last 4 weeks',
    medium_term: 'Last 6 months',
    long_term: 'Last 12 months',
  };

  return (
    <>
      <Navigation />
      <div className="w-full flex justify-between items-center gap-2 p-2">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {title}
        </h2>
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
          <Button>
            Create playlist <Plus />
          </Button>
        </div>
      </div>
    </>
  );
}
