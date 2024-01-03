import { test, expect } from "@playwright/test";

test("/api/ping returns expected result 'pong'", async ({ request }) => {
  const response = await request.get("/api/ping");
  expect(response.ok()).toBeTruthy();

  expect(await response.text()).toEqual("pong");
});
