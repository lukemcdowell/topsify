import { BrowserContext } from "@playwright/test";

/**
 * Inject auth cookies to simulate a logged-in user.
 * With MOCK=true, the access_token value doesn't matter — only its presence.
 */
export async function setAuthCookies(context: BrowserContext) {
  await context.addCookies([
    {
      name: "access_token",
      value: "mock-access-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
    {
      name: "refresh_token",
      value: "mock-refresh-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
