import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-max min-h-screen m-auto flex justify-center items-center">
      <div>
        <h1>Top Spotify</h1>
        <Button asChild>
          <Link href="/api/login">Login with Spotify</Link>
        </Button>
      </div>
    </div>
  );
}
