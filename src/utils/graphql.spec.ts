import { executeExchange } from "@urql/exchange-execute";
import gql from "graphql-tag";
import { createSchema } from "graphql-yoga";
import { cacheExchange, createClient } from "urql";
import { absoluteGraphqlUrl } from "utils/environment";
import { QueryInfo, getQueryFields } from "utils/graphql";

const schema = createSchema({
  typeDefs: gql`
    type Test {
      id: ID
      name: String
      description: String
      isCool: Boolean
      testQueryInfoJson: String
    }

    type Query {
      test: Test
    }
  `,
  resolvers: {
    Query: {
      test: (_: never, _args: never, _context: never, info: QueryInfo) => {
        return {
          id: "ee448828-447e-47c4-bf23-366b61dad134",
          name: "Cool Test Object",
          description: "This test object, it's very cool!",
          isCool: true,
          testQueryInfoJson: JSON.stringify(info),
        };
      },
    },
  },
});

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

const client = createClient({
  url: absoluteGraphqlUrl,
  exchanges: [cacheExchange, executeExchange({ schema })],
});

test("getQueryFields() returns array of fields requested in a GraphQL query DocumentNode, and not '__typename'.", async () => {
  const res = await client.query(query, {});
  const json = res?.data?.test?.testQueryInfoJson;
  expect(json).toBeTruthy();
  const testQueryInfo = JSON.parse(json);

  const fields = getQueryFields(testQueryInfo);

  expect(fields).toEqual(expect.arrayContaining(["id", "name", "isCool", "testQueryInfoJson"]));
  expect(fields).not.toEqual(expect.arrayContaining(["__typename"]));
});
