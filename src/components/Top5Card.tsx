import { TopArtistType, TopTrackType } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import TopArtist from './TopArtist';
import TopTrack from './TopTrack';
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
  itemData: TopTrackType[] | TopArtistType[];
}

function Top5Card({ itemType, itemData }: Top5CardProps) {
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
            <CardTitle className="pb-2">{cardText.title}</CardTitle>
            <CardDescription>{cardText.description}</CardDescription>
          </div>
          <Button asChild>
            <Link href={itemType}>
              View all <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {itemData.map((item, index) =>
          itemType === 'tracks' ? (
            <TopTrack key={index} trackData={item as TopTrackType} />
          ) : (
            <TopArtist key={index} artistData={item as TopArtistType} />
          )
        )}
      </CardContent>
    </Card>
  );
}

export default Top5Card;
