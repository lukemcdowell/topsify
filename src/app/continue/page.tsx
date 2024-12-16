import { Button } from '@/components/ui/button';
import Link from 'next/link';

function page() {
  return (
    <div className="max-w-max f-full m-auto flex flex-col items-center gap-4 px-20 sm:px-0 pt-48 sm:pt-52">
      <p className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
        Your top tracks and artists, all in one place
      </p>
      <Button asChild>
        <Link href="/api/login">Continue with Spotify</Link>
      </Button>
    </div>
  );
}

export default page;
