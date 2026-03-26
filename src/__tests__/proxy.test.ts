import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

function makeRequest(path: string, cookies: Record<string, string> = {}) {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  return new NextRequest(`http://127.0.0.1:3000${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

describe("proxy middleware", () => {
  it("redirects /dashboard to / when refresh_token is missing", async () => {
    const req = makeRequest("/dashboard");
    const res = await proxy(req);
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain("/");
  });

  it("allows /dashboard through when refresh_token is present", async () => {
    const req = makeRequest("/dashboard", { refresh_token: "tok" });
    const res = await proxy(req);
    expect(res.status).toBe(200); // NextResponse.next()
  });

  it("redirects / to /dashboard when refresh_token is present", async () => {
    const req = makeRequest("/", { refresh_token: "tok" });
    const res = await proxy(req);
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain("/dashboard");
  });

  it("allows / through when refresh_token is missing", async () => {
    const req = makeRequest("/");
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("allows /dashboard/tracks through when refresh_token is present", async () => {
    const req = makeRequest("/dashboard/tracks", { refresh_token: "tok" });
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });
});
