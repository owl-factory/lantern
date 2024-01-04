import { test, expect } from "@playwright/test";

// todo ID that is created in migrations, so we can expect it to exists.
const ID = "57cc22f8-b4d5-44cb-a473-97b69911b9a0";

test("/api/todo/[id] returns expected todo from the database", async ({ request }) => {
  const response = await request.get(`/api/todo/${ID}`);
  expect(response.ok()).toBeTruthy();

  const res = await response.json();

  expect(res).toMatchObject({
    description: "Kiss girls",
    done: true,
  });
});
