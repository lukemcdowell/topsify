import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Navigation", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("navigates from dashboard to tracks page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Tracks card "View all" is first; artists card "View all" is second
    await page.getByRole("link", { name: /view all/i }).nth(0).click();
    await expect(page).toHaveURL("/dashboard/tracks");
  });

  test("navigates from dashboard to artists page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /view all/i }).nth(1).click();
    await expect(page).toHaveURL("/dashboard/artists");
  });

  test("nav links on tracks page navigate to artists", async ({ page }) => {
    await page.goto("/dashboard/tracks");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /artists/i }).click();
    await expect(page).toHaveURL("/dashboard/artists");
  });

  test("nav links on artists page navigate to tracks", async ({ page }) => {
    await page.goto("/dashboard/artists");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /tracks/i }).click();
    await expect(page).toHaveURL("/dashboard/tracks");
  });
});
