import { getQueryFields } from "utils/graphql";
import { getServerClient } from "lib/graphql/serverClient";
import { GraphQLResolveInfo } from "graphql";

jest.mock("lib/graphql/serverClient");

/** This needs to be a plain string to avoid breaking the GraphQL typecheck extension. */
const query = `
  query Test {
    test {
      id
      name
      isCool
      testQueryInfoJson
    }
  }
`;

test("getQueryFields() returns array of fields requested in a GraphQL query DocumentNode, and not '__typename'.", async () => {
  const client = getServerClient();
  const res = await client.query(query, {});
  const json = res?.data?.test?.testQueryInfoJson as string;
  expect(json).toBeTruthy();
  const testQueryInfo = JSON.parse(json) as GraphQLResolveInfo;

  const fields = getQueryFields(testQueryInfo);

  expect(fields).toEqual(expect.arrayContaining(["id", "name", "isCool", "testQueryInfoJson"]));
  expect(fields).not.toEqual(expect.arrayContaining(["__typename"]));
});
