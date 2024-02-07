import { absoluteGraphqlUrl, baseUrl, isServer, remoteApiUrl } from "utils/environment";

test("isServer const is false in current 'jsdom' Jest test environment.", () => {
  expect(isServer).toBe(false);
});

test("baseUrl const is the expected 'http://localhost:3000' pulled from the '.env.development' file.", () => {
  expect(baseUrl).toBe("http://localhost:3000");
});

test("remoteApiUrl const is the expected empty string, because it is not defined in the '.env.development' file used for testing.", () => {
  expect(remoteApiUrl).toBe("");
});

test("absoluteGraphqlUrl const is the expected development URL of the GraphQL API.", () => {
  expect(absoluteGraphqlUrl).toBe("http://localhost:3000/api/graphql");
});
