import { getValidAccessToken } from "@/lib/auth";
import { COOKIE_NAMES } from "@/lib/cookies";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

import { cookies } from "next/headers";

function makeCookieStore(values: Record<string, string | undefined>) {
  return {
    get: (name: string) => {
      const value = values[name];
      return value ? { value } : undefined;
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getValidAccessToken", () => {
  it("returns the access token when it is present", async () => {
    vi.mocked(cookies).mockResolvedValue(
      makeCookieStore({
        [COOKIE_NAMES.ACCESS_TOKEN]: "valid-access-token",
      }) as never,
    );

    const token = await getValidAccessToken();
    expect(token).toBe("valid-access-token");
  });

  it("redirects to /api/refresh when only refresh_token is present", async () => {
    vi.mocked(cookies).mockResolvedValue(
      makeCookieStore({
        [COOKIE_NAMES.REFRESH_TOKEN]: "valid-refresh-token",
      }) as never,
    );

    await expect(getValidAccessToken("/dashboard")).rejects.toThrow(
      "NEXT_REDIRECT:/api/refresh?redirect=/dashboard",
    );
  });

  it("redirects to / when no tokens are present", async () => {
    vi.mocked(cookies).mockResolvedValue(
      makeCookieStore({}) as never,
    );

    await expect(getValidAccessToken()).rejects.toThrow("NEXT_REDIRECT:/");
  });
});
