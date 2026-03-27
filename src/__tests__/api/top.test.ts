import { GET } from "@/app/api/top/route";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/spotifyApi", () => ({
  getTopTracks: vi.fn().mockResolvedValue([{ name: "Track 1" }]),
  getTopArtists: vi.fn().mockResolvedValue([{ name: "Artist 1" }]),
}));

vi.mock("@/lib/serverToken", () => ({
  getServerAccessToken: vi.fn().mockResolvedValue("server-token"),
}));

import { getTopArtists, getTopTracks } from "@/lib/spotifyApi";

function makeRequest(params: Record<string, string>) {
  const search = new URLSearchParams(params).toString();
  return new NextRequest(`http://127.0.0.1:3000/api/top?${search}`);
}

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.MOCK;
});

afterEach(() => {
  delete process.env.MOCK;
});

describe("GET /api/top", () => {
  it("returns 500 when type is missing", async () => {
    const req = makeRequest({ limit: "5", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when type is invalid", async () => {
    const req = makeRequest({ type: "playlists", limit: "5", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when limit is missing", async () => {
    const req = makeRequest({ type: "tracks", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when timeRange is invalid", async () => {
    const req = makeRequest({ type: "tracks", limit: "5", timeRange: "yearly" });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns tracks using server token", async () => {
    const req = makeRequest({ type: "tracks", limit: "5", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(vi.mocked(getTopTracks)).toHaveBeenCalledWith("long_term", 5, "server-token");
  });

  it("returns artists using server token", async () => {
    const req = makeRequest({ type: "artists", limit: "10", timeRange: "short_term" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(vi.mocked(getTopArtists)).toHaveBeenCalledWith("short_term", 10, "server-token");
  });

  it("returns mock data when MOCK=true (no token needed)", async () => {
    process.env.MOCK = "true";
    const req = makeRequest({ type: "tracks", limit: "5", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeLessThanOrEqual(5);
  });

  it("slices mock data to the requested limit", async () => {
    process.env.MOCK = "true";
    const req = makeRequest({ type: "artists", limit: "3", timeRange: "long_term" });
    const res = await GET(req);
    const data = await res.json();
    expect(data.length).toBeLessThanOrEqual(3);
  });

  it("returns 500 when getTopTracks throws", async () => {
    vi.mocked(getTopTracks).mockRejectedValueOnce(new Error("API error"));
    const req = makeRequest({ type: "tracks", limit: "5", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
