import {
  addTracksToPlaylist,
  createPlaylist,
  getArtistTopTrack,
  getUserId,
} from "@/lib/spotifyApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { type, playlistName, publicPlaylist, uris, timeRange } = await request.json();

  if (!accessToken) {
    return NextResponse.redirect(new URL("/api/login", request.url));
  }

  if (!playlistName) {
    return new NextResponse("Error: no name supplied", {
      status: 400,
    });
  }

  if (!uris || uris.length === 0) {
    return new NextResponse("Error: no URIs supplied", {
      status: 400,
    });
  }

  try {
    const userId = await getUserId(accessToken);

    const playlistId = await createPlaylist(
      userId,
      playlistName,
      publicPlaylist,
      accessToken,
      timeRange,
      type,
    );

    let trackUris: string[] = [];
    if (type == "artists") {
      for (const uri of uris) {
        const artistId = uri.split(":")[2];
        const trackUri = await getArtistTopTrack(artistId, accessToken);
        trackUris.push(trackUri);
      }
    } else {
      trackUris = uris;
    }

    await addTracksToPlaylist(playlistId, trackUris, accessToken);
    return new NextResponse(JSON.stringify({ playlistId }), { status: 201 });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return new NextResponse("Error creating playlist", {
      status: 500,
    });
  }
}
