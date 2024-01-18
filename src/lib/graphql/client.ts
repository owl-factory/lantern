import { cacheExchange, createClient, fetchExchange } from "urql";
import { registerUrql } from "@urql/next/rsc";
import { baseUrl } from "utils/environment";

const remoteUrl = process.env.NEXT_PUBLIC_GRAPHQL_REMOTE_URL;
const isRemote = Boolean(remoteUrl);
const graphUrl = isRemote ? remoteUrl : baseUrl + "/api/graphql";

const makeClient = () => {
  return createClient({
    url: graphUrl,
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
