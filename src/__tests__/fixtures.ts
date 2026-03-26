import { TopArtistType, TopTrackType } from "@/lib/types";

export const mockTrack: TopTrackType = {
  name: "Test Track",
  uri: "spotify:track:abc123",
  href: "https://api.spotify.com/v1/tracks/abc123",
  external_urls: { spotify: "https://open.spotify.com/track/abc123" },
  album: {
    name: "Test Album",
    images: [{ url: "https://i.scdn.co/image/test", height: 300, width: 300 }],
    external_urls: { spotify: "https://open.spotify.com/album/album1" },
    artists: [
      {
        name: "Test Artist",
        href: "https://api.spotify.com/v1/artists/artist1",
        id: "artist1",
        uri: "spotify:artist:artist1",
      },
    ],
  },
  artists: [
    {
      name: "Test Artist",
      href: "https://api.spotify.com/v1/artists/artist1",
      external_urls: { spotify: "https://open.spotify.com/artist/artist1" },
      id: "artist1",
      uri: "spotify:artist:artist1",
    },
  ],
};

export const mockArtist: TopArtistType = {
  name: "Test Artist",
  uri: "spotify:artist:artist1",
  external_urls: { spotify: "https://open.spotify.com/artist/artist1" },
  genres: ["pop", "rock"],
  images: [
    { url: "https://i.scdn.co/image/artist1", height: 300, width: 300 },
  ],
};

export function makeTracks(count: number): TopTrackType[] {
  return Array.from({ length: count }, (_, i) => ({
    ...mockTrack,
    name: `Track ${i + 1}`,
    uri: `spotify:track:track${i}`,
  }));
}

export function makeArtists(count: number): TopArtistType[] {
  return Array.from({ length: count }, (_, i) => ({
    ...mockArtist,
    name: `Artist ${i + 1}`,
    uri: `spotify:artist:artist${i}`,
  }));
}
