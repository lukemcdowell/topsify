import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Artists page", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("renders the artists page at /artists", async ({ page }) => {
    await page.goto("/artists");
    await expect(page).toHaveURL("/artists");
  });

  test("shows artist items after loading", async ({ page }) => {
    await page.goto("/artists");

    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
  });

  test("time range buttons are visible", async ({ page }) => {
    await page.goto("/artists");

    await expect(
      page.getByRole("button", { name: /long-term/i }),
    ).toBeVisible();
  });

  test("switching time range updates the view", async ({ page }) => {
    await page.goto("/artists");

    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /long-term/i }).click();
    await page.getByRole("menuitemradio", { name: /medium-term/i }).click();

    await expect(
      page.getByRole("button", { name: /medium-term/i }),
    ).toBeVisible();
  });

  test("does not show a create playlist button on artists page", async ({
    page,
  }) => {
    await page.goto("/artists");

    // Wait for page to load, then confirm no create playlist button
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });

    // The artists page doesn't expose a create playlist button (no trackUris)
    await expect(
      page.getByRole("button", { name: /create playlist/i }),
    ).not.toBeVisible();
  });
});
