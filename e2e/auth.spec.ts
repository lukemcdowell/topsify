import { expect, test } from "@playwright/test";

test.describe("Routing", () => {
  test("/ redirects to /dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/dashboard");
  });

  test("can access /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });
});
