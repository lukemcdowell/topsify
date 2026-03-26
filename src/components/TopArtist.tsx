import { blurPlaceholder } from "@/lib/utils";
import { TopArtistType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Card
              className="flex items-center gap-3 p-2 w-full border hover:bg-zinc-900 hover:border-primary cursor-pointer"
              onClick={handleDialogOpen}
            >
              <Image
                alt={artistData.name}
                className="h-16 w-16 rounded object-contain"
                src={artistData.images[0]?.url}
                width={artistData.images[0]?.width}
                height={artistData.images[0]?.height}
                placeholder="blur"
                blurDataURL={blurPlaceholder()}
              />
              <div className="min-w-0 flex-1 text-start">
                <p className="text-md font-medium leading-none text-white truncate">
                  {artistData.name}
                </p>
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 text-md">
            <span className="text-primary">#{index + 1}: </span>
            <div className="text-md">{artistData.name}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="text-white max-w-sm">
          <DialogHeader className="w-full min-w-0">
            <DialogTitle className="text-2xl font-bold mb-1 flex">
              <span className="text-2xl text-primary pr-3">#{index + 1}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center w-full min-w-0">
            <Link href={artistLink} target="_blank">
              <Image
                alt={`${artistData.name}`}
                className="h-80 w-80 rounded object-contain mb-4"
                src={artistData.images[0]?.url}
                width={artistData.images[0]?.width}
                height={artistData.images[0]?.height}
                placeholder="blur"
                blurDataURL={blurPlaceholder()}
              />
            </Link>
            <Link
              href={artistLink}
              className="text-2xl text-center font-semibold hover:underline w-full truncate block"
              target="_blank"
            >
              {artistData.name}
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TopArtist;
