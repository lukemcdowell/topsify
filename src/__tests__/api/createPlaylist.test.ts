import { POST } from "@/app/api/createPlaylist/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/spotifyApi", () => ({
  createPlaylist: vi.fn().mockResolvedValue("playlist123"),
  addTracksToPlaylist: vi.fn().mockResolvedValue(undefined),
}));

import { addTracksToPlaylist, createPlaylist } from "@/lib/spotifyApi";

function makeRequest(
  body: Record<string, unknown>,
  cookies: Record<string, string> = {},
) {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  return new NextRequest("http://127.0.0.1:3000/api/createPlaylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createPlaylist).mockResolvedValue("playlist123");
  vi.mocked(addTracksToPlaylist).mockResolvedValue(undefined);
});

describe("POST /api/createPlaylist", () => {
  it("redirects to /api/login when no access token", async () => {
    const req = makeRequest({
      playlistName: "My Playlist",
      publicPlaylist: false,
      uris: ["uri1"],
    });
    const res = await POST(req);
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.headers.get("location")).toContain("/api/login");
  });

  it("returns 400 when playlist name is missing", async () => {
    const req = makeRequest(
      { publicPlaylist: false, uris: ["uri1"] },
      { access_token: "tok" },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when URIs are empty", async () => {
    const req = makeRequest(
      { playlistName: "My Playlist", publicPlaylist: false, uris: [] },
      { access_token: "tok" },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when URIs are missing", async () => {
    const req = makeRequest(
      { playlistName: "My Playlist", publicPlaylist: false },
      { access_token: "tok" },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates playlist and returns 201 with playlistId on success", async () => {
    const req = makeRequest(
      {
        playlistName: "My Playlist",
        publicPlaylist: true,
        uris: ["spotify:track:1", "spotify:track:2"],
        timeRange: "long_term",
      },
      { access_token: "valid-token" },
    );
    const res = await POST(req);

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.playlistId).toBe("playlist123");
    expect(vi.mocked(createPlaylist)).toHaveBeenCalledWith(
      "My Playlist",
      true,
      "valid-token",
      "long_term",
    );
    expect(vi.mocked(addTracksToPlaylist)).toHaveBeenCalledWith(
      "playlist123",
      ["spotify:track:1", "spotify:track:2"],
      "valid-token",
    );
  });

  it("returns 500 when createPlaylist throws", async () => {
    vi.mocked(createPlaylist).mockRejectedValue(new Error("API error"));

    const req = makeRequest(
      { playlistName: "My Playlist", publicPlaylist: false, uris: ["uri1"] },
      { access_token: "tok" },
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
