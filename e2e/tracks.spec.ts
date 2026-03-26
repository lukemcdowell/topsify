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

    // Wait for the skeleton to resolve
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
  });

  test("time range buttons are visible", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await expect(
      page.getByRole("button", { name: /long-term/i }),
    ).toBeVisible();
  });

  test("switching time range updates the displayed data", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    // Wait for initial load
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });

    // Click the time range dropdown
    await page.getByRole("button", { name: /long-term/i }).click();

    // Select short-term
    await page.getByRole("menuitemradio", { name: /short-term/i }).click();

    // The button should now show short-term
    await expect(
      page.getByRole("button", { name: /short-term/i }),
    ).toBeVisible();
  });

  test("create playlist button opens the dialog", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    // Wait for page to stabilize before interacting (tracks load and re-render)
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });

    const createBtn = page.getByRole("button", { name: /create playlist/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("create playlist dialog shows success after submission", async ({
    page,
  }) => {
    await page.route("**/api/createPlaylist", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ playlistId: "mock-playlist-id" }),
      });
    });

    await page.goto("/dashboard/tracks");

    // Wait for tracks to load so page is stable
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /create playlist/i }).click();

    // Click the "Create playlist" submit button inside the dialog
    await page.getByRole("dialog").getByRole("button", { name: /create playlist/i }).click();

    await expect(
      page.getByText("Playlist created successfully!"),
    ).toBeVisible({ timeout: 5000 });
  });
});
