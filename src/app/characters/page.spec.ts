import { test, expect } from "@playwright/test";

test("dynamic character sheet", async ({ page }) => {
  await page.goto("/characters");
  await expect(page.getByRole("heading", { name: "Characters" })).toBeInViewport();

  await expect(page.getByText(/No Name/i)).not.toBeInViewport();
  await page.getByText(/Add Character/i).click();
  await expect(page.getByText(/No Name/i)).toBeInViewport();

  // Test the collapse
  await expect(page.getByText(/testing the collapse/i)).toBeVisible();
  await page.getByRole("button", { name: /Toggle Collapse/i }).click();
  await expect(page.getByText(/testing the collapse/i)).not.toBeVisible();

  // Switch to Character Sheet
  await page.getByText(/Character Sheet/i).click();

  // Switch to Spells
  await page.getByText("Bio", { exact: true }).click();
});
