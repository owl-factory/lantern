import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { schema } from "lib/graphql/schema";

const remoteUrl = process.env.NEXT_PUBLIC_GRAPHQL_REMOTE_URL;
const isRemote = remoteUrl !== null && remoteUrl !== "";

const link = isRemote ? new HttpLink({ uri: remoteUrl }) : new SchemaLink({ schema });

/**
 * Apollo client for use in nextjs react server components.
 * We may switch to urql. https://formidable.com/open-source/urql/docs
 */
export const getRscApolloClient = registerApolloClient(() => {
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}).getClient;

/* URQL */

import { cacheExchange, createClient, fetchExchange } from "urql";
import { registerUrql } from "@urql/next/rsc";
import { baseUrl } from "utils/environment";

const url = isRemote ? remoteUrl : baseUrl + "/api/graphql/yoga";

const makeClient = () => {
  return createClient({
    url,
    exchanges: [cacheExchange, fetchExchange],
  });
};

export const getRscUrqlClient = registerUrql(makeClient).getClient;
