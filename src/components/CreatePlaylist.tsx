import { ExternalLink, ListCheck, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface CreatePlaylistProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selected: 'tracks' | 'artists';
  trackUris?: string[];
  artistUris?: string[];
  defaultPlaylistName: string;
}

function CreatePlaylist({
  isDialogOpen,
  setIsDialogOpen,
  selected,
  trackUris,
  artistUris,
  defaultPlaylistName,
}: CreatePlaylistProps) {
  const [playlistName, setPlaylistName] = useState('');
  const [publicPlaylist, setPublicPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlistId, setPlaylistId] = useState('');

  const handleCreatePlaylist = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/createPlaylist', {
        method: 'POST',
        body: JSON.stringify({
          type: selected,
          playlistName: playlistName || defaultPlaylistName,
          publicPlaylist: publicPlaylist,
          uris: selected === 'tracks' ? trackUris : artistUris,
        }),
      });

      if (response.ok) {
        console.log('Playlist created successfully!');
        setPlaylistId((await response.json()).playlistId);
      } else {
        console.error('Failed to create playlist');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setPlaylistCreated(true);
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-1">
            Create playlist
          </DialogTitle>
          <DialogDescription>
            {selected === 'tracks'
              ? 'Make a playlist from your favourite tracks.'
              : "Make a playlist from your favourite artist's top tracks."}
          </DialogDescription>
        </DialogHeader>

        {playlistCreated ? (
          <Alert>
            <ListCheck className="h-4 w-4" />
            <AlertTitle>Playlist created!</AlertTitle>
            <AlertDescription>
              {/* TODO: style */}
              <Link
                className="text-primary"
                href={`https://open.spotify.com/playlist/${playlistId}`}
              >
                Open in Spotify.
                <ExternalLink />
              </Link>
            </AlertDescription>
          </Alert>
        ) : (
          newPlaylistDetails
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlaylist;
