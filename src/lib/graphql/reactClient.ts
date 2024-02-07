import { Client, SSRExchange, cacheExchange, createClient, fetchExchange, ssrExchange } from "urql";
import { absoluteGraphqlUrl } from "utils/environment";

/**
 * urql client getter for use in the React component tree (mostly through query hooks). This works on the client and in NextJs SSR, with hydration.
 * @returns tuple of urql server-side-rendering data exchange and a urql Client instance configured for Lantern that is intended for use in react query hooks.
 */
export function getReactClient(authToken?: string): [Client, SSRExchange] {
  const ssr = ssrExchange();
  const client = createClient({
    url: absoluteGraphqlUrl,
    exchanges: [cacheExchange, ssr, fetchExchange],
    suspense: true,
    fetchOptions: authToken
      ? {
          headers: {
            Authorization: authToken,
          },
        }
      : undefined,
  });

  return [client, ssr];
}
