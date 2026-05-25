import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Tracks page", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("renders the tracks page at /dashboard/tracks", async ({ page }) => {
    await page.goto("/dashboard/tracks");
    await expect(page).toHaveURL("/dashboard/tracks");
  });

  test("shows track items or error after loading", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await expect(
      page.locator("img").or(page.getByRole("alert")).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("time range buttons are visible", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await expect(
      page.getByRole("button", { name: /long-term/i }),
    ).toBeVisible();
  });

  test("switching time range updates the selector label", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await page.getByRole("button", { name: /long-term/i }).click();
    await page.getByRole("menuitemradio", { name: /short-term/i }).click();

    await expect(
      page.getByRole("button", { name: /short-term/i }),
    ).toBeVisible();
  });
});
