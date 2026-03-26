import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Navigation", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("navigates from dashboard to tracks page", async ({ page }) => {
    await page.goto("/dashboard");

    // Tracks card "View all" is first; artists card "View all" is second
    await page.getByRole("link", { name: /view all/i }).nth(0).click();
    await expect(page).toHaveURL("/dashboard/tracks");
  });

  test("navigates from dashboard to artists page", async ({ page }) => {
    await page.goto("/dashboard");

    await page.getByRole("link", { name: /view all/i }).nth(1).click();
    await expect(page).toHaveURL("/dashboard/artists");
  });

  test("nav links on tracks page navigate to artists", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await page.getByRole("link", { name: /artists/i }).click();
    await expect(page).toHaveURL("/dashboard/artists");
  });

  test("nav links on artists page navigate to tracks", async ({ page }) => {
    await page.goto("/dashboard/artists");

    await page.getByRole("link", { name: /tracks/i }).click();
    await expect(page).toHaveURL("/dashboard/tracks");
  });

  test("logout button redirects to the login page", async ({ page }) => {
    await page.goto("/dashboard");

    // Logout is rendered as an <a href="/api/logout"> inside a button-styled element
    await page.getByRole("link", { name: /log out/i }).click();

    // The redirect goes to / — check by content rather than exact URL
    // (Next.js may normalize 127.0.0.1 → localhost in server-side redirects)
    await expect(
      page.getByRole("link", { name: /continue with spotify/i }),
    ).toBeVisible();
  });
});
