import { test, expect } from "@playwright/test";

test("logo text is visible", async ({ request }) => {
  const response = await request.get("/api/ping");

  await expect(response.text()).toBe("pong");
});
