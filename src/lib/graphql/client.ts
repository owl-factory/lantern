import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { baseUrl } from "utils/environment";

const remoteUrl = process.env.NEXT_PUBLIC_GRAPHQL_REMOTE_URL;
const isRemote = remoteUrl !== null && remoteUrl !== "";

const link = isRemote ? new HttpLink({ uri: remoteUrl }) : new HttpLink({ uri: baseUrl + "/api/graphql" });

/**
 * Apollo client for use in nextjs react server components.
 * We may switch to urql. https://formidable.com/open-source/urql/docs
 */
export const getRscGqlClient = registerApolloClient(() => {
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}).getClient;
