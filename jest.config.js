module.exports = {
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
    "tsx"
  ],
  testEnvironment: "node",
  testRegex: "\.spec\.ts$",
  transform: {
    "^.+\\.(tsx|ts|js)?$": "ts-jest"
  },
  coverageDirectory: "../coverage",
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "text-summary"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js",
    "@owl-factory/(.*)": "<rootDir>/src/@owl-factory/$1",
    "fauna/(.*)": "<rootDir>/src/fauna/$1"
  },
};
