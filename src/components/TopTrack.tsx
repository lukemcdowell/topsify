import { TopTrackType } from '@/lib/types';
import { Card } from './ui/card';

interface TopTrackProps {
  trackData: TopTrackType;
}

function TopTrack({ trackData }: TopTrackProps) {
  return (
    <Card className="flex items-center gap-3 p-2 w-full border hover:bg-zinc-900 hover:border-primary cursor-pointer">
      <img
        alt={`${trackData.name} by ${trackData.artists[0].name}`}
        className="h-16 w-16 rounded"
        src={trackData.album.images[0]?.url}
      />
      <div className="min-w-0 flex-1">
        <p className="text-md font-medium leading-none text-white truncate">
          {trackData.name}
        </p>
        <p className="text-sm text-zinc-400 mt-1 truncate">
          {trackData.artists[0].name}
        </p>
      </div>
    </Card>
  );
}

export default TopTrack;
