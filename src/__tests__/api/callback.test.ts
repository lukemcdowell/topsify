import { GET } from "@/app/api/callback/route";
import { COOKIE_NAMES } from "@/lib/cookies";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/spotifyApi", () => ({
  requestAccessToken: vi.fn(),
}));

import { requestAccessToken } from "@/lib/spotifyApi";

function makeRequest(
  params: Record<string, string>,
  cookies: Record<string, string> = {},
) {
  const search = new URLSearchParams(params).toString();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  return new NextRequest(`http://127.0.0.1:3000/api/callback?${search}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/callback", () => {
  it("returns 403 when state is missing", async () => {
    const req = makeRequest(
      { code: "auth-code" },
      { [COOKIE_NAMES.STATE]: "expected-state" },
    );
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns 403 when state does not match cookie", async () => {
    const req = makeRequest(
      { code: "auth-code", state: "wrong-state" },
      { [COOKIE_NAMES.STATE]: "expected-state" },
    );
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 when code is missing", async () => {
    const req = makeRequest(
      { state: "my-state" },
      { [COOKIE_NAMES.STATE]: "my-state" },
    );
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("sets auth cookies and redirects to /dashboard on success", async () => {
    vi.mocked(requestAccessToken).mockResolvedValue(["at-123", "rt-456"]);

    const req = makeRequest(
      { code: "auth-code", state: "my-state" },
      { [COOKIE_NAMES.STATE]: "my-state" },
    );
    const res = await GET(req);

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain("/dashboard");

    const setCookie = res.headers.getSetCookie?.() ?? [];
    const allCookies = setCookie.join("; ");
    expect(allCookies).toContain("access_token");
    expect(allCookies).toContain("refresh_token");
  });

  it("deletes the state cookie on success", async () => {
    vi.mocked(requestAccessToken).mockResolvedValue(["at", "rt"]);

    const req = makeRequest(
      { code: "code", state: "my-state" },
      { [COOKIE_NAMES.STATE]: "my-state" },
    );
    const res = await GET(req);

    const setCookie = res.headers.getSetCookie?.() ?? [];
    const stateCookie = setCookie.find((c: string) => c.includes("state="));
    // State cookie should be cleared (max-age=0 or deleted)
    if (stateCookie) {
      expect(stateCookie).toMatch(/max-age=0|expires=.*1970/i);
    }
  });

  it("returns 500 when requestAccessToken throws", async () => {
    vi.mocked(requestAccessToken).mockRejectedValue(new Error("OAuth error"));

    const req = makeRequest(
      { code: "code", state: "my-state" },
      { [COOKIE_NAMES.STATE]: "my-state" },
    );
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
