import { test, expect } from "@playwright/test";

const contentSetQuery = `
query Content {
  contentSet(contentTypeId: "904c33ee-f41c-4227-8192-16c41dbc206f") {
    data
    id
    name
    visibility
  }
}
`;

test("graphql api post", async ({ request }) => {
  const response = await request.post("/", {
    data: {
      query: contentSetQuery,
    },
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const jsonResponse = await response.json();
  expect(jsonResponse.data.contentSet.length).toBe(3);
});
