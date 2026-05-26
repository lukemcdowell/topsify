import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Navigation", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("navigates from dashboard to tracks page", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      (document.querySelector('a[href="/tracks"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/tracks");
  });

  test("navigates from dashboard to artists page", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      (document.querySelector('a[href="/artists"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/artists");
  });

  test("nav links on tracks page navigate to artists", async ({ page }) => {
    await page.goto("/tracks");

    await page.evaluate(() => {
      (document.querySelector('a[href="/artists"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/artists");
  });

  test("nav links on artists page navigate to tracks", async ({ page }) => {
    await page.goto("/artists");

    await page.evaluate(() => {
      (document.querySelector('a[href="/tracks"]') as HTMLAnchorElement)?.click();
    });
    await expect(page).toHaveURL("/tracks");
  });
});
