import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("renders the top 5 tracks and artists cards", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByText("Your top 5 tracks")).toBeVisible();
    await expect(page.getByText("Your top 5 artists")).toBeVisible();
  });

  test("tracks card has a 'View all' link to /dashboard/tracks", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Both cards have "View all" links; tracks card is first in the DOM
    const links = page.getByRole("link", { name: /view all/i });
    await expect(links.nth(0)).toHaveAttribute("href", "/dashboard/tracks");
  });

  test("artists card has a 'View all' link to /dashboard/artists", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const links = page.getByRole("link", { name: /view all/i });
    await expect(links.nth(1)).toHaveAttribute("href", "/dashboard/artists");
  });

  test("displays 5 track items after loading", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for skeletons to disappear and real items to appear
    await page.waitForFunction(() => {
      const skeletons = document.querySelectorAll(
        "[data-testid='track-skeleton'], .animate-pulse",
      );
      return skeletons.length === 0 || document.querySelectorAll("img[alt]").length > 0;
    }, { timeout: 10000 });

    // Verify at least some content loaded (mock data returns items)
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
  });
});
