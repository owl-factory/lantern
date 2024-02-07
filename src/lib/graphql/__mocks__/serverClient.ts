import { cacheExchange, createClient } from "urql";
import { absoluteGraphqlUrl } from "utils/environment";
import { executeExchange } from "@urql/exchange-execute";
import gql from "graphql-tag";
import { createSchema } from "graphql-yoga";
import { GraphQLResolveInfo } from "graphql";

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
      test: (_: never, _args: never, _context: never, info: GraphQLResolveInfo) => {
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

/**
 * actual urql client that is safe to use in tests, connected to an executable schema with mocked data.
 */
export const testClient = createClient({
  url: absoluteGraphqlUrl,
  exchanges: [cacheExchange, executeExchange({ schema })],
});

export function getServerClient() {
  return testClient;
}
