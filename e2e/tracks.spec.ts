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

  test("shows track items after loading", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Walk This Land")).toBeVisible();
  });

  test("time range buttons are visible", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await expect(
      page.getByRole("button", { name: /long-term/i }),
    ).toBeVisible();
  });

  test("switching time range updates the displayed data", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await page.waitForLoadState("networkidle");

    // Click the time range dropdown
    await page.getByRole("button", { name: /long-term/i }).click();

    // Select short-term
    await page.getByRole("menuitemradio", { name: /short-term/i }).click();

    // The button should now show short-term
    await expect(
      page.getByRole("button", { name: /short-term/i }),
    ).toBeVisible();
  });
});
