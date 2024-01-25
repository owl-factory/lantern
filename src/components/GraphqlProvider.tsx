"use client";

import { useMemo } from "react";
import { UrqlProvider } from "@urql/next";
import { getReactClient } from "lib/graphql/reactClient";

interface GraphqlProviderProps {
  children: React.ReactNode;
  authToken?: string;
}

/**
 * urql context provider to allow use of GraphQL queries with a useQuery() hook within the React component tree.
 * This hook supports SSR and React Suspense.
 */
export function GraphqlProvider(props: GraphqlProviderProps) {
  const [client, ssr] = useMemo(() => {
    return getReactClient(props.authToken);
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {props.children}
    </UrqlProvider>
  );
}
