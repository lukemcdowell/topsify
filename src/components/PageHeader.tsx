'use client';

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
    short_term: 'Short term',
    medium_term: 'Medium term',
    long_term: 'Long term',
  };
  const defaultPlaylistName = `My ${timeRangeMapping[
    timeRange
  ].toLowerCase()} top ${selected === 'tracks' ? 'tracks' : 'artists'}`;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [publicPlaylist, setPublicPlaylist] = useState(false);

  const handleCreatePlaylist = async () => {
    try {
      const response = await fetch('/api/createPlaylist', {
        method: 'POST',
        body: JSON.stringify({
          type: selected,
          playlistName: playlistName || defaultPlaylistName,
          publicPlaylist: publicPlaylist,
          uris: selected === 'tracks' ? trackUris : artistUris,
        }),
      });

      if (response.ok) {
        console.log('Playlist created successfully!');
      } else {
        console.error('Failed to create playlist');
      }
    } catch (error) {
      console.error(error);
    }
  };

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
              {selected === 'tracks'
                ? 'Make a playlist from your favourite tracks.'
                : "Make a playlist from your favourite artist's top tracks."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Label>Playlist name: </Label>
            <Input
              placeholder={defaultPlaylistName}
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private-playlist"
              checked={publicPlaylist}
              onCheckedChange={(checked) => setPublicPlaylist(checked)}
            />
            <Label htmlFor="private-playlist">Make playlist public</Label>
          </div>

          <Button onClick={handleCreatePlaylist} className="mt-6">
            Create playlist <Plus />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
