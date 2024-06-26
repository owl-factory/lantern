import { defineConfig } from "@playwright/test";

/**
 * TODO remove 'dotenv' by loading env file using native NodeJs feature
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { config } from "dotenv";
config({ path: "./.env.development" });

import { getGitCommitId } from "utils/config.mjs";
process.env.NEXT_PUBLIC_BUILD_GIT_COMMIT = getGitCommitId();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src/app",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "line" : "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    extraHTTPHeaders: {
      // Add long lived test authorization token to all requests.
      Authorization: `Bearer ${process.env.TEST_AUTH_TOKEN}`,
    },
  },

  quiet: process.env.QUIET_PLAYWRIGHT ? true : false,

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
