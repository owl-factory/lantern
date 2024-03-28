import { test, expect } from "@playwright/test";
import { version } from "data/package";
import { buildGitCommit } from "utils/environment";

test("/api/version returns current package.json version", async ({ request }) => {
  const response = await request.get("/api/version");
  expect(response.ok()).toBeTruthy();

  expect(await response.json()).toMatchObject({
    version,
    commit: buildGitCommit,
  });
});
