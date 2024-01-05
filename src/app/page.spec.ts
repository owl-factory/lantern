import { test, expect } from "@playwright/test";

test("logo text is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("logo-text")).toBeVisible();
});
