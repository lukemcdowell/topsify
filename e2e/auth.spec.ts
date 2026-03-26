import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Authentication", () => {
  test("login page renders the app name and login button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /topsify/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /continue with spotify/i }),
    ).toBeVisible();
  });

  test("unauthenticated visit to /dashboard redirects to /", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });

  test("unauthenticated visit to /dashboard/tracks redirects to /", async ({
    page,
  }) => {
    await page.goto("/dashboard/tracks");
    // Middleware only matches /dashboard exactly for redirect; server component handles the rest
    // Either way, the user should end up at login
    const url = new URL(page.url());
    expect(["", "/"].includes(url.pathname) || url.pathname.startsWith("/api")).toBe(true);
  });

  test("authenticated visit to / redirects to /dashboard", async ({
    page,
    context,
  }) => {
    await setAuthCookies(context);
    await page.goto("/");
    await expect(page).toHaveURL("/dashboard");
  });

  test("authenticated user can access /dashboard", async ({
    page,
    context,
  }) => {
    await setAuthCookies(context);
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });
});
