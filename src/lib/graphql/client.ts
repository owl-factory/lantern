import { cacheExchange, createClient, fetchExchange } from "urql";
import { registerUrql } from "@urql/next/rsc";
import { absoluteGraphqlEndpoint } from "utils/environment";

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
