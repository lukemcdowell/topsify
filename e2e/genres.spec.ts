import { expect, test } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Genres page", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("renders the genres page at /dashboard/genres", async ({ page }) => {
    await page.goto("/dashboard/genres");
    await expect(page).toHaveURL("/dashboard/genres");
  });

  test("shows the bar chart after loading", async ({ page }) => {
    await page.goto("/dashboard/genres");

    // Wait for skeleton to clear and SVG chart to appear
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10000 });
  });

  test("time range buttons are visible", async ({ page }) => {
    await page.goto("/dashboard/genres");

    await expect(
      page.getByRole("button", { name: /long-term/i }),
    ).toBeVisible();
  });

  test("switching time range updates the view", async ({ page }) => {
    await page.goto("/dashboard/genres");

    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /long-term/i }).click();
    await page.getByRole("menuitemradio", { name: /medium-term/i }).click();

    await expect(
      page.getByRole("button", { name: /medium-term/i }),
    ).toBeVisible();
  });

  test("genres nav link is highlighted on the genres page", async ({ page }) => {
    await page.goto("/dashboard/genres");

    const genresLink = page.getByRole("link", { name: /genres/i }).first();
    await expect(genresLink).toHaveClass(/border-primary/);
  });
});

test.describe("Dashboard genres card", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("genres card is visible on the dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByText("Your top 5 genres")).toBeVisible();
  });

  test("genres card has a 'View all' link to /dashboard/genres", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const links = page.getByRole("link", { name: /view all/i });
    // Tracks is nth(0), artists is nth(1), genres is nth(2)
    await expect(links.nth(2)).toHaveAttribute("href", "/dashboard/genres");
  });

  test("genres pie chart renders after loading", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for data to load — SVG chart should appear
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Navigation — genres", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("navigates from dashboard to genres page via View all", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const links = page.getByRole("link", { name: /view all/i });
    await links.nth(2).click();
    await expect(page).toHaveURL("/dashboard/genres");
  });

  test("genres nav tab is present on the tracks page", async ({ page }) => {
    await page.goto("/dashboard/tracks");

    await expect(
      page.getByRole("link", { name: /genres/i }),
    ).toBeVisible();
  });

  test("clicking genres nav tab navigates to genres page", async ({ page }) => {
    await page.goto("/dashboard/tracks");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /genres/i }).click();
    await expect(page).toHaveURL("/dashboard/genres");
  });
});
