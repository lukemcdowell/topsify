import {
  getTopArtists,
  getTopTracks,
  requestRefreshedAccessToken,
} from "@/lib/spotifyApi";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock getEnvVariable so the module-level constants can be set without real env vars
vi.mock("@/lib/utils", () => ({
  getEnvVariable: (key: string) => `mock-${key}`,
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
  blurPlaceholder: () => "data:image/svg+xml;base64,mock",
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeFetchResponse(
  data: unknown,
  ok = true,
  status = 200,
): Response {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Bad Request",
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("requestRefreshedAccessToken", () => {
  it("returns new tokens on success", async () => {
    mockFetch.mockResolvedValue(
      makeFetchResponse({
        access_token: "new-at",
        refresh_token: "new-rt",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "",
      }),
    );

    const result = await requestRefreshedAccessToken("old-rt");
    expect(result).toEqual(["new-at", "new-rt"]);
  });

  it("falls back to old refresh token when not in response", async () => {
    mockFetch.mockResolvedValue(
      makeFetchResponse({
        access_token: "new-at",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "",
      }),
    );

    const result = await requestRefreshedAccessToken("old-rt");
    expect(result).toEqual(["new-at", "old-rt"]);
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(makeFetchResponse(null, false, 401));
    await expect(requestRefreshedAccessToken("bad-rt")).rejects.toThrow();
  });
});

describe("getTopTracks", () => {
  it("returns track items from the response", async () => {
    const items = [{ name: "Track 1" }, { name: "Track 2" }];
    mockFetch.mockResolvedValue(makeFetchResponse({ items }));

    const result = await getTopTracks("long_term", 5, "token");
    expect(result).toEqual(items);
  });

  it("passes correct query params", async () => {
    mockFetch.mockResolvedValue(makeFetchResponse({ items: [] }));
    await getTopTracks("short_term", 10, "token");

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("time_range=short_term");
    expect(url).toContain("limit=10");
    expect(url).toContain("/me/top/tracks");
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(makeFetchResponse(null, false, 401));
    await expect(getTopTracks("long_term", 5, "token")).rejects.toThrow();
  });
});

describe("getTopArtists", () => {
  it("returns artist items from the response", async () => {
    const items = [{ name: "Artist 1" }];
    mockFetch.mockResolvedValue(makeFetchResponse({ items }));

    const result = await getTopArtists("medium_term", 5, "token");
    expect(result).toEqual(items);
  });

  it("passes correct query params", async () => {
    mockFetch.mockResolvedValue(makeFetchResponse({ items: [] }));
    await getTopArtists("medium_term", 5, "token");

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/me/top/artists");
    expect(url).toContain("time_range=medium_term");
  });
});

