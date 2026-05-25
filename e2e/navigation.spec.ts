import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Navigation", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("navigates from dashboard to tracks page", async ({ page }) => {
    await page.goto("/dashboard");

    await page.evaluate(() => {
      (document.querySelector('a[href="/dashboard/tracks"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/dashboard/tracks");
  });

  test("navigates from dashboard to artists page", async ({ page }) => {
    await page.goto("/dashboard");

    await page.evaluate(() => {
      (document.querySelector('a[href="/dashboard/artists"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/dashboard/artists");
  });

  test("nav links on tracks page navigate to artists", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await page.evaluate(() => {
      (document.querySelector('a[href="/dashboard/artists"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/dashboard/artists");
  });

  test("nav links on artists page navigate to tracks", async ({ page }) => {
    await page.goto("/dashboard/artists");

    await page.evaluate(() => {
      (document.querySelector('a[href="/dashboard/tracks"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/dashboard/tracks");
  });
});
