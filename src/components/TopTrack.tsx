import { TopTrackType } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface TopTrackProps {
  index: number;
  trackData: TopTrackType;
}

function TopTrack({ index, trackData }: TopTrackProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const artistList = trackData.artists.map((artist) => artist.name).join(', ');
  const trackLink = trackData.external_urls.spotify;
  const albumLink = trackData.album.external_urls.spotify;

  const renderArtistLinks = () => (
    <div className="flex gap-1 ml-12">
      {trackData.artists.map((artist, index) => (
        <Link
          href={artist.external_urls.spotify}
          className="text-lg text-zinc-300 hover:underline truncate"
          target="_blank"
        >
          {index === trackData.artists.length - 1
            ? artist.name
            : `${artist.name}, `}
        </Link>
      ))}
    </div>
  );

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className="flex items-center gap-3 p-2 w-full border hover:bg-zinc-900 hover:border-primary cursor-pointer"
        onClick={handleDialogOpen}
      >
        <img
          alt={`${trackData.name} by ${artistList}`}
          className="h-16 w-16 rounded"
          src={trackData.album.images[0]?.url}
        />
        <div className="min-w-0 flex-1">
          <p className="text-md font-medium leading-none text-white truncate">
            {trackData.name}
          </p>
          <p className="text-sm text-zinc-400 mt-1 truncate">{artistList}</p>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">
              <span className="text-2xl text-primary pr-3">#{index + 1}:</span>

              {/* TODO: fix long track names overflowing */}
              <Link
                href={trackLink}
                className="text-2xl font-semibold hover:underline truncate"
                target="_blank"
              >
                {trackData.name}
              </Link>
              {renderArtistLinks()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Link href={albumLink} target="_blank">
              <img
                alt={`${trackData.name} by ${trackData.artists[0].name}`}
                className="h-64 w-64 rounded mb-4"
                src={trackData.album.images[0]?.url}
              />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TopTrack;
