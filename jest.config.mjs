// eslint-disable-next-line tsdoc/syntax
/** @type {import('jest').Config} */
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const jestConfig = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleDirectories: ["src", "node_modules"],
  modulePathIgnorePatterns: ["src/app", "src/components", "archive"],
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(jestConfig);
