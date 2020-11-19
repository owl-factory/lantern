module.exports = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: [
    "**/*.(test|spec).(ts|tsx)"
  ],
  globals: {
    "ts-jest": {
      babelConfig: true,
      diagnostics: {
        pathRegex: /\.(spec|test)\.ts$/,
        warnOnly: true
      },
      tsconfig: "jest.tsconfig.json"
    }
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "enzyme.js"
  ],
  setupFilesAfterEnv: [
   
  ],
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "text-summary"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js"
  },
  preset: "@shelf/jest-mongodb"
};