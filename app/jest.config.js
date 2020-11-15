export const moduleFileExtensions = [
  "ts",
  "tsx",
  "js"
];
export const transform = {
  "^.+\\.tsx?$": "ts-jest"
};
export const testMatch = [
  "**/*.(test|spec).(ts|tsx)"
];
export const globals = {
  "ts-jest": {
    babelConfig: true,
    diagnostics: {
      pathRegex: /\.(spec|test)\.ts$/,
      warnOnly: true
    },
    tsConfig: "jest.tsconfig.json"
  }
};
export const coveragePathIgnorePatterns = [
  "/node_modules/",
  "enzyme.js"
];
export const setupFilesAfterEnv = [];
export const coverageReporters = [
  "json",
  "lcov",
  "text",
  "text-summary"
];
export const moduleNameMapper = {
  "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
  "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js"
};