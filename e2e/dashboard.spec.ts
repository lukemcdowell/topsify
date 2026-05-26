import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("renders the top 5 tracks and artists cards", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("My top 5 tracks")).toBeVisible();
    await expect(page.getByText("My top 5 artists")).toBeVisible();
  });

  test("tracks card has a 'View all' link to /tracks", async ({
    page,
  }) => {
    await page.goto("/");

    // Both cards have "View all" links; tracks card is first in the DOM
    const links = page.getByRole("link", { name: /view all/i });
    await expect(links.nth(0)).toHaveAttribute("href", "/tracks", { timeout: 10000 });
  });

  test("artists card has a 'View all' link to /artists", async ({
    page,
  }) => {
    await page.goto("/");

    const links = page.getByRole("link", { name: /view all/i });
    await expect(links.nth(1)).toHaveAttribute("href", "/artists", { timeout: 10000 });
  });

  test("displays track items or error after loading", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator("img").or(page.getByRole("alert")).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
