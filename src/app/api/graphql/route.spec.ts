import { test, expect } from "@playwright/test";
import { graphqlUrl } from "utils/environment";

const contentSetQuery = `
query ContentSet {
  contentSet(contentTypeId: "904c33ee-f41c-4227-8192-16c41dbc206f") {
    data
    id
    name
    visibility
  }
}
`;

const contentQuery = `
content(id: "02d4ff74-8767-449e-9f87-8327090a2e6d") {
  data
  id
  name
  visibility
}
`;

test("test GraphQL API 'contentSet' resolver using a standard HTTP POST request", async ({
  request,
}) => {
  const response = await request.post(graphqlUrl, {
    data: {
      query: contentSetQuery,
    },
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const jsonResponse = await response.json();
  const contentSet = jsonResponse.data.contentSet;
  expect(contentSet.length).toBeGreaterThan(2);
});

test("test GraphQL API 'content' resolver using a standard HTTP POST request", async ({
  request,
}) => {
  const response = await request.post(graphqlUrl, {
    data: {
      query: contentQuery,
    },
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  expect(jsonResponse.data).toMatchObject({
    id: "02d4ff74-8767-449e-9f87-8327090a2e6d",
    name: "Kiss girls",
  });
});
