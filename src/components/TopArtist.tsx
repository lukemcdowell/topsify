import { TopArtistType } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface TopArtistProps {
  index: number;
  artistData: TopArtistType;
}

function TopArtist({ index, artistData }: TopArtistProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const artistLink = artistData.external_urls.spotify;

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className="flex items-center gap-3 p-2 w-full border hover:bg-zinc-900 hover:border-primary cursor-pointer"
        onClick={handleDialogOpen}
      >
        {/* TODO: look at best way to display non-square images */}
        <img
          alt={artistData.name}
          className="h-16 w-16 rounded"
          src={artistData.images[0]?.url}
        />
        <div className="min-w-0 flex-1">
          <p className="text-md font-medium leading-none text-white truncate">
            {artistData.name}
          </p>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">
              <span className="text-2xl text-primary pr-3">#{index + 1}:</span>

              <Link
                href={artistLink}
                className="text-2xl font-semibold hover:underline truncate"
                target="_blank"
              >
                {artistData.name}
              </Link>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Link href={artistLink} target="_blank">
              <img
                alt={`${artistData.name}`}
                className="h-64 w-64 rounded mb-4"
                src={artistData.images[0]?.url}
              />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TopArtist;
