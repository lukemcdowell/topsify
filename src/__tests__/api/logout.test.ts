import { GET } from "@/app/api/logout/route";
import { COOKIE_NAMES } from "@/lib/cookies";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

describe("GET /api/logout", () => {
  it("redirects to /", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/logout");
    const res = await GET(req);

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain("/");
  });

  it("clears the access_token cookie", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/logout", {
      headers: { cookie: "access_token=mytoken; refresh_token=myrefresh" },
    });
    const res = await GET(req);

    const setCookie = res.headers.getSetCookie?.() ?? [];
    const atCookie = setCookie.find((c: string) =>
      c.includes(COOKIE_NAMES.ACCESS_TOKEN),
    );
    expect(atCookie).toBeDefined();
    expect(atCookie).toMatch(/max-age=0|expires=.*1970/i);
  });

  it("clears the refresh_token cookie", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/logout", {
      headers: { cookie: "access_token=mytoken; refresh_token=myrefresh" },
    });
    const res = await GET(req);

    const setCookie = res.headers.getSetCookie?.() ?? [];
    const rtCookie = setCookie.find((c: string) =>
      c.includes(COOKIE_NAMES.REFRESH_TOKEN),
    );
    expect(rtCookie).toBeDefined();
    expect(rtCookie).toMatch(/max-age=0|expires=.*1970/i);
  });
});
