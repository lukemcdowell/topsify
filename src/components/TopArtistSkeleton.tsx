import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

function TopArtistSkeleton() {
  return (
    <Card className="flex items-center gap-3 p-2 w-full border">
      <Skeleton id="img-skeleton" className="h-16 w-16 rounded" />
      <div className="min-w-0 flex-1">
        <Skeleton
          id="artist-name-skeleton"
          className="h-[14px] w-[100px] rounded"
        />
      </div>
    </Card>
  );
}

export default TopArtistSkeleton;
