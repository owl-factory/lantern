import { cacheExchange, createClient, fetchExchange } from "urql";
import { registerUrql } from "@urql/next/rsc";
import { absoluteGraphqlUrl, apiIsRemote } from "utils/environment";
import { executeExchange } from "@urql/exchange-execute";
import { schema } from "lib/graphql/schema";

const serverFetchExchange = !apiIsRemote ? executeExchange({ schema }) : fetchExchange;

/**
 * urql client getter for use only server side (such as NextJs React Server Components).
 */
export const getServerClient = registerUrql(() => {
  return createClient({
    url: absoluteGraphqlUrl,
    exchanges: [cacheExchange, serverFetchExchange],
  });
}).getClient;
