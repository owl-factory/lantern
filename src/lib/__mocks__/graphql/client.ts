import { cacheExchange, createClient } from "urql";
import { absoluteGraphqlUrl } from "utils/environment";
import { executeExchange } from "@urql/exchange-execute";
import { schema } from "lib/graphql/schema";

/**
 * actual urql client that is safe to use in tests, connected to an executable schema.
 */
export const testClient = createClient({
  url: absoluteGraphqlUrl,
  exchanges: [cacheExchange, executeExchange({ schema })],
});

export function getServerClient() {
  return testClient;
}
