import { TimeRangeType } from "@/lib/types";
import { ExternalLink, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface CreatePlaylistProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  timeRange: TimeRangeType;
  trackUris?: string[];
  defaultPlaylistName: string;
}

function CreatePlaylist({
  isDialogOpen,
  setIsDialogOpen,
  timeRange,
  trackUris,
  defaultPlaylistName,
}: CreatePlaylistProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [publicPlaylist, setPublicPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlistError, setPlaylistError] = useState(false);
  const [playlistId, setPlaylistId] = useState("");

  const handleCreatePlaylist = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/createPlaylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tracks",
          playlistName: playlistName || defaultPlaylistName,
          publicPlaylist: publicPlaylist,
          uris: trackUris,
          timeRange,
        }),
      });

      if (response.ok) {
        setPlaylistId((await response.json()).playlistId);
        setPlaylistCreated(true);
      } else {
        setPlaylistError(true);
      }
    } catch (error) {
      console.error(error);
      setPlaylistError(true);
    }
    setLoading(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPlaylistCreated(false);
    setPlaylistError(false);
    setPlaylistId("");
    setPlaylistName("");
    setPublicPlaylist(false);
  };

  const newPlaylistDetails = (
    <>
      <div className="grid w-full max-w-sm items-center gap-2 mt-4">
        <Label>Playlist name: </Label>
        <Input
          placeholder={defaultPlaylistName}
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="private-playlist"
          checked={publicPlaylist}
          onCheckedChange={(checked) => setPublicPlaylist(checked)}
        />
        <Label htmlFor="private-playlist">Make playlist public</Label>
      </div>
      {loading ? (
        <Button disabled className="mt-6">
          <Loader2 className="animate-spin" />
          Creating playlist...
        </Button>
      ) : (
        <Button onClick={handleCreatePlaylist} className="mt-6">
          Create playlist <Plus />
        </Button>
      )}
    </>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-1">
            Create playlist
          </DialogTitle>
          <DialogDescription>
            {playlistCreated
              ? "Playlist created successfully!"
              : playlistError
                ? "Something went wrong. Please try again."
                : "Make a playlist from your favourite tracks."}
          </DialogDescription>
        </DialogHeader>

        {playlistCreated ? (
          <Button>
            <Link
              href={`https://open.spotify.com/playlist/${playlistId}`}
              target="_blank"
            >
              Open in Spotify
            </Link>
            <ExternalLink />
          </Button>
        ) : playlistError ? (
          <Button variant="outline" onClick={() => setPlaylistError(false)}>
            Try again
          </Button>
        ) : (
          newPlaylistDetails
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlaylist;
