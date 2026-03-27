import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetModules();
});

describe("isRateLimited", () => {
  it("allows requests under the limit", async () => {
    const { isRateLimited } = await import("@/lib/rateLimit");
    for (let i = 0; i < 30; i++) {
      expect(isRateLimited("1.2.3.4")).toBe(false);
    }
  });

  it("blocks requests over the limit within the window", async () => {
    const { isRateLimited } = await import("@/lib/rateLimit");
    for (let i = 0; i < 30; i++) isRateLimited("1.2.3.4");
    expect(isRateLimited("1.2.3.4")).toBe(true);
  });

  it("resets after the window expires", async () => {
    const { isRateLimited } = await import("@/lib/rateLimit");
    for (let i = 0; i < 30; i++) isRateLimited("1.2.3.4");
    vi.advanceTimersByTime(60_001);
    expect(isRateLimited("1.2.3.4")).toBe(false);
  });

  it("tracks IPs independently", async () => {
    const { isRateLimited } = await import("@/lib/rateLimit");
    for (let i = 0; i < 30; i++) isRateLimited("1.2.3.4");
    expect(isRateLimited("1.2.3.4")).toBe(true);
    expect(isRateLimited("5.6.7.8")).toBe(false);
  });
});
