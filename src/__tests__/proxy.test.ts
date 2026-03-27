import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

function makeRequest(path: string) {
  return new NextRequest(`http://127.0.0.1:3000${path}`);
}

describe("proxy middleware", () => {
  it("allows all routes through without auth", async () => {
    const paths = ["/", "/dashboard", "/dashboard/tracks", "/dashboard/artists", "/dashboard/genres"];
    for (const path of paths) {
      const res = await proxy(makeRequest(path));
      expect(res.status).toBe(200);
    }
  });
});
