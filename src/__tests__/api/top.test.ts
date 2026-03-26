import { GET } from "@/app/api/top/route";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/spotifyApi", () => ({
  getTopTracks: vi.fn().mockResolvedValue([{ name: "Track 1" }]),
  getTopArtists: vi.fn().mockResolvedValue([{ name: "Artist 1" }]),
}));

import { getTopArtists, getTopTracks } from "@/lib/spotifyApi";

function makeRequest(
  params: Record<string, string>,
  cookies: Record<string, string> = {},
) {
  const search = new URLSearchParams(params).toString();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  return new NextRequest(`http://127.0.0.1:3000/api/top?${search}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
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
    const req = makeRequest({
      type: "playlists",
      limit: "5",
      timeRange: "long_term",
    });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when limit is missing", async () => {
    const req = makeRequest({ type: "tracks", timeRange: "long_term" });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when timeRange is invalid", async () => {
    // timeRange validation happens after auth check, so a token is required
    const req = makeRequest(
      { type: "tracks", limit: "5", timeRange: "yearly" },
      { access_token: "tok" },
    );
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("redirects to /api/login when no access token (non-mock mode)", async () => {
    const req = makeRequest({
      type: "tracks",
      limit: "5",
      timeRange: "long_term",
    });
    const res = await GET(req);
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.headers.get("location")).toContain("/api/login");
  });

  it("returns tracks when access token is present", async () => {
    const req = makeRequest(
      { type: "tracks", limit: "5", timeRange: "long_term" },
      { access_token: "valid-token" },
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(vi.mocked(getTopTracks)).toHaveBeenCalledWith(
      "long_term",
      5,
      "valid-token",
    );
  });

  it("returns artists when access token is present", async () => {
    const req = makeRequest(
      { type: "artists", limit: "10", timeRange: "short_term" },
      { access_token: "valid-token" },
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(vi.mocked(getTopArtists)).toHaveBeenCalledWith(
      "short_term",
      10,
      "valid-token",
    );
  });

  it("returns mock data when MOCK=true (no access token needed)", async () => {
    process.env.MOCK = "true";
    const req = makeRequest({
      type: "tracks",
      limit: "5",
      timeRange: "long_term",
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeLessThanOrEqual(5);
  });

  it("slices mock data to the requested limit", async () => {
    process.env.MOCK = "true";
    const req = makeRequest({
      type: "artists",
      limit: "3",
      timeRange: "long_term",
    });
    const res = await GET(req);
    const data = await res.json();
    expect(data.length).toBeLessThanOrEqual(3);
  });

  it("returns 500 when getTopTracks throws", async () => {
    vi.mocked(getTopTracks).mockRejectedValueOnce(new Error("API error"));
    const req = makeRequest(
      { type: "tracks", limit: "5", timeRange: "long_term" },
      { access_token: "token" },
    );
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
