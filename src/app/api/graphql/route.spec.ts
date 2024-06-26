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
query Content {
  content(id: "02d4ff74-8767-449e-9f87-8327090a2e6d") {
    data
    id
    name
    visibility
  }
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
  const content = jsonResponse.data.content;
  expect(content).toMatchObject({
    id: "02d4ff74-8767-449e-9f87-8327090a2e6d",
    name: "Kiss girls",
    visibility: "public",
    data: {
      done: true,
      description: "Kiss girls",
    },
  });
});

test("test GraphQL sandbox endpoint", async ({ page }) => {
  await page.goto(graphqlUrl);
  await page.waitForURL(graphqlUrl);
  await expect(page.locator("#embedded-sandbox")).toBeVisible();
  await expect(page.getByTestId("apollo-script")).toHaveAttribute(
    "src",
    "https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"
  );
});
