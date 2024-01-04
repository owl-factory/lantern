// TODO fix playwright authentication issues, likely do to failed env variable import
// (one of three final tasks before PR ready for review)

import { test, expect } from "@playwright/test";

// TODO ID that is created in migrations, so we can expect it to exists.
const ID = "57cc22f8-b4d5-44cb-a473-97b69911b9a0";

test("/api/todo/[id] returns expected todo from the database", async ({ request }) => {
  const response = await request.get(`/api/todo/${ID}`);
  expect(response.ok()).toBeTruthy();

  const res = await response.json();

  expect(res.description).toBe("Kiss girls");
  expect(res.done).toBe(true);

  expect(res).toMatchObject({
    description: "Kiss girls",
    done: true,
  });
});
