import { TopArtistType } from '@/lib/types';
import { Card } from './ui/card';

interface TopArtistProps {
  artistData: TopArtistType;
}

function TopArtist({ artistData }: TopArtistProps) {
  return (
    <Card className="flex items-center gap-3 p-2 w-full max-w-sm border hover:bg-zinc-900 hover:border-primary cursor-pointer">
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
  );
}

export default TopArtist;
