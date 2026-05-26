import { expect, test } from "@playwright/test";

test.describe("Routing", () => {
  test("/ renders the dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });
});
