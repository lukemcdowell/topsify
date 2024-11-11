import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-max min-h-screen m-auto flex flex-col justify-center items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-5">
        Top Spotify
      </h1>
      <Button asChild>
        <Link href="/top">Continue with Spotify</Link>
      </Button>
    </div>
  );
}
