import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Top5CardProps {
  itemType: "tracks" | "artists" | "genres";
  children: React.ReactNode;
  hideViewAll?: boolean;
}

function Top5Card({ itemType, children, hideViewAll }: Top5CardProps) {
  const itemTypeMapping: Record<
    "tracks" | "artists" | "genres",
    { title: string; description: React.ReactNode }
  > = {
    tracks: {
      title: "Tracks",
      description: <><s>Your</s> My top 5 tracks</>,
    },
    artists: {
      title: "Artists",
      description: <><s>Your</s> My top 5 artists</>,
    },
    genres: {
      title: "Genres",
      description: <><s>Your</s> My top 5 genres</>,
    },
  };
  const cardText = itemTypeMapping[itemType];

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between">
          <div>
            <CardTitle>{cardText.title}</CardTitle>
            <CardDescription>{cardText.description}</CardDescription>
          </div>
          {!hideViewAll && (
            <Button asChild>
              <Link href={`/dashboard/${itemType}`}>
                View all <ChevronRight />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  );
}

export default Top5Card;
