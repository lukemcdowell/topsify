import { Button } from "@/components/ui/button";
import { CircleUserRound, Disc3, ListMusic } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
        <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight">
          Top
          <span className="bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            s
          </span>
          <span className="text-primary">ify</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Discover your top tracks and artists from Spotify, and turn them into
          playlists.
        </p>

        <Button asChild size="lg" className="mt-2 w-full sm:w-auto px-10">
          <Link href="/api/login">Continue with Spotify</Link>
        </Button>

        <div className="grid grid-cols-3 gap-3 mt-6 w-full">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
            <Disc3 className="text-primary h-5 w-5" />
            <span className="text-xs font-medium text-muted-foreground">
              Top Tracks
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
            <CircleUserRound className="text-primary h-5 w-5" />
            <span className="text-xs font-medium text-muted-foreground">
              Top Artists
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
            <ListMusic className="text-primary h-5 w-5" />
            <span className="text-xs font-medium text-muted-foreground">
              Playlists
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
