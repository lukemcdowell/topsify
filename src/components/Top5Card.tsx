import Link from 'next/link';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

interface Top5CardProps {
  itemType: 'tracks' | 'artists';
}

function Top5Card({ itemType }: Top5CardProps) {
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
        <CardTitle>{cardText.title}</CardTitle>
        <CardDescription>{cardText.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/tracks">{cardText.buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Top5Card;
