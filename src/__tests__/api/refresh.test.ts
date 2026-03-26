import { GET } from "@/app/api/refresh/route";
import { COOKIE_NAMES } from "@/lib/cookies";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/spotifyApi", () => ({
  requestRefreshedAccessToken: vi.fn(),
}));

import { requestRefreshedAccessToken } from "@/lib/spotifyApi";

function makeRequest(
  searchParams: Record<string, string> = {},
  cookies: Record<string, string> = {},
) {
  const search = new URLSearchParams(searchParams).toString();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  return new NextRequest(
    `http://127.0.0.1:3000/api/refresh${search ? `?${search}` : ""}`,
    { headers: cookieHeader ? { cookie: cookieHeader } : {} },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/refresh", () => {
  it("redirects to / when no refresh_token cookie", async () => {
    const req = makeRequest();
    const res = await GET(req);
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.headers.get("location")).toContain("/");
  });

  it("sets new access_token cookie and redirects to /dashboard on success", async () => {
    vi.mocked(requestRefreshedAccessToken).mockResolvedValue(["new-at", "new-rt"]);

    const req = makeRequest({}, { [COOKIE_NAMES.REFRESH_TOKEN]: "old-rt" });
    const res = await GET(req);

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.headers.get("location")).toContain("/dashboard");

    const setCookie = res.headers.getSetCookie?.() ?? [];
    expect(setCookie.join(" ")).toContain("access_token");
  });

  it("redirects to the specified ?redirect= path", async () => {
    vi.mocked(requestRefreshedAccessToken).mockResolvedValue(["at", "rt"]);

    const req = makeRequest(
      { redirect: "/dashboard/tracks" },
      { [COOKIE_NAMES.REFRESH_TOKEN]: "rt" },
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toContain("/dashboard/tracks");
  });

  it("ignores unsafe redirect paths (open redirect protection)", async () => {
    vi.mocked(requestRefreshedAccessToken).mockResolvedValue(["at", "rt"]);

    const req = makeRequest(
      { redirect: "//evil.com" },
      { [COOKIE_NAMES.REFRESH_TOKEN]: "rt" },
    );
    const res = await GET(req);
    // Should redirect to /dashboard, not external URL
    expect(res.headers.get("location")).toContain("/dashboard");
    expect(res.headers.get("location")).not.toContain("evil.com");
  });

  it("redirects to / when refresh fails", async () => {
    vi.mocked(requestRefreshedAccessToken).mockRejectedValue(
      new Error("Token expired"),
    );

    const req = makeRequest({}, { [COOKIE_NAMES.REFRESH_TOKEN]: "bad-rt" });
    const res = await GET(req);
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.headers.get("location")).toContain("/");
  });
});
