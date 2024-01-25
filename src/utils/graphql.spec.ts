import gql from "graphql-tag";
import { getQueryFields } from "utils/graphql";
import { getServerClient } from "lib/graphql/serverClient";

jest.mock("lib/graphql/serverClient");

const query = gql`
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
  const json = res?.data?.test?.testQueryInfoJson;
  expect(json).toBeTruthy();
  const testQueryInfo = JSON.parse(json);

  const fields = getQueryFields(testQueryInfo);

  expect(fields).toEqual(expect.arrayContaining(["id", "name", "isCool", "testQueryInfoJson"]));
  expect(fields).not.toEqual(expect.arrayContaining(["__typename"]));
});
