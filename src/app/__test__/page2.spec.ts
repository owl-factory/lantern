import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await expect(page.getByRole("heading", { name: /Hello World/ })).toBeVisible();
});
