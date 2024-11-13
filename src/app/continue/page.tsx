import { Button } from '@/components/ui/button';
import Link from 'next/link';

function page() {
  return (
    <div className="max-w-max min-h-screen m-auto flex flex-col justify-center items-center">
      <Button asChild>
        <Link href="/api/login">Continue with Spotify</Link>
      </Button>
    </div>
  );
}

export default page;
