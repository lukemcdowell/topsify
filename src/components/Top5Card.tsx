import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface Top5CardProps {
  itemType: 'tracks' | 'artists';
  children: React.ReactNode;
}

function Top5Card({ itemType, children }: Top5CardProps) {
  const itemTypeMapping = {
    tracks: {
      title: 'Tracks',
      description: 'Your top 5 tracks',
      buttonText: 'View all tracks',
    },
    artists: {
      title: 'Artists',
      description: 'Your top 5 artists',
      buttonText: 'View all artists',
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
          <Button asChild>
            <Link href={itemType}>
              View all <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  );
}

export default Top5Card;
