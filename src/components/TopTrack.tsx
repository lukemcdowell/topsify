import { TopTrackType } from '@/lib/types';
import Image from 'next/image';
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
    <div className="flex gap-1">
      {trackData.artists.map((artist, index) => (
        <Link
          key={index}
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
        <Image
          alt={`${trackData.name} by ${artistList}`}
          className="h-16 w-16 rounded"
          src={trackData.album.images[0]?.url}
          width={trackData.album.images[0]?.width}
          height={trackData.album.images[0]?.height}
          placeholder="blur"
          blurDataURL={trackData.album.images[2]?.url}
        />
        <div className="min-w-0 flex-1">
          <p className="text-md font-medium leading-none text-white truncate">
            {trackData.name}
          </p>
          <p className="text-sm text-zinc-400 mt-1 truncate">{artistList}</p>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="text-white max-w-md">
        <DialogHeader className="w-full min-w-0">
            <DialogTitle className="text-2xl font-bold mb-1 flex">
              <span className="text-2xl text-primary pr-3">#{index + 1}:</span>
              <div className="min-w-0 w-full">
                <Link
                  href={trackLink}
                  className="text-2xl font-semibold hover:underline truncate block"
                  target="_blank"
                >
                  {trackData.name}
                </Link>
                {renderArtistLinks()}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Link href={albumLink} target="_blank">
              <Image
                alt={`${trackData.name} by ${trackData.artists[0].name}`}
                className="h-80 w-80 rounded mb-4"
                src={trackData.album.images[0]?.url}
                width={trackData.album.images[0]?.width}
                height={trackData.album.images[0]?.height}
                placeholder="blur"
                blurDataURL={trackData.album.images[2]?.url}
              />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TopTrack;
