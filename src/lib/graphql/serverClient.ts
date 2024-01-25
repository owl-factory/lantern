import { cacheExchange, createClient, fetchExchange } from "urql";
import { registerUrql } from "@urql/next/rsc";
import { absoluteGraphqlUrl, apiIsRemote } from "utils/environment";
import { executeExchange } from "@urql/exchange-execute";
import { schema } from "lib/graphql/schema";

const serverFetchExchange = !apiIsRemote ? executeExchange({ schema }) : fetchExchange;

/**
 * urql client getter for server side use only, such as in an RSC (React Server Component), or a NextJs Server Action.
 * @returns urql server-only Client instance configured for Lantern.
 */
export const getServerClient = registerUrql(() => {
  return createClient({
    url: absoluteGraphqlUrl,
    exchanges: [cacheExchange, serverFetchExchange],
  });
}).getClient;
