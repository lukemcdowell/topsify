import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TimeRangeType } from '@/lib/types';
import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import Navigation from './Navigation';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const defaultPlaylistName = timeRangeMapping[timeRange].toLowerCase();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
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
          <Button onClick={handleDialogOpen}>
            Create playlist <Plus />
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">
              Create playlist
            </DialogTitle>
            <DialogDescription>
              Make a playlist from your favorite Spotify tracks.
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Label>Playlist name: </Label>
            <Input placeholder={`My top tracks ${defaultPlaylistName}`} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="private-playlist" />
            <Label htmlFor="private-playlist">Make playlist public</Label>
          </div>

          <Button onClick={handleDialogOpen} className="mt-6">
            Create playlist <Plus />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
