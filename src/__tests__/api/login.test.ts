import { GET } from "@/app/api/login/route";
import { COOKIE_NAMES } from "@/lib/cookies";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/spotifyApi", () => ({
  createAuthURL: vi.fn(() => [
    "https://accounts.spotify.com/authorize?client_id=mock-SPOTIFY_CLIENT_ID",
    "random-state-16ch",
  ]),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/login", () => {
  it("redirects to the Spotify authorize URL", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/login");
    const res = await GET();

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain(
      "accounts.spotify.com/authorize",
    );
  });

  it("sets the state cookie with httpOnly and short maxAge", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/login");
    const res = await GET();

    const setCookie = res.headers.getSetCookie?.() ?? [];
    const stateCookie = setCookie.find((c: string) =>
      c.includes(COOKIE_NAMES.STATE),
    );
    expect(stateCookie).toBeDefined();
    expect(stateCookie).toContain("HttpOnly");
  });
});
