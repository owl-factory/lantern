import { cacheExchange, createClient, fetchExchange } from "urql";
import { registerUrql } from "@urql/next/rsc";
import { absoluteGraphqlEndpoint } from "utils/environment";
////import { executeExchange } from "@urql/exchange-execute";
////import { schema } from "lib/graphql/schema";

////const serverExchange = graphqlIsRemote ? fetchExchange : executeExchange({ schema });
////const srrExchange = isServer ? serverExchange : fetchExchange;

const makeClient = () => {
  return createClient({
    url: absoluteGraphqlEndpoint,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: {
        Authorization: process.env.TEST_AUTH_TOKEN,
      },
    },
  });
};

/**
 * urql client getter for use in NextJs React Server Components.
 */
export const getServerClient = registerUrql(makeClient).getClient;
