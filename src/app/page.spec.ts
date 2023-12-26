import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  await expect(page.getByRole("heading", { name: /Hello World/ })).toBeVisible();
});
