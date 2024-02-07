"use client";

import { useContext, useMemo } from "react";
import { UrqlProvider } from "@urql/next";
import { getReactClient } from "lib/graphql/reactClient";
import { EnvironmentContext } from "context/EnvironmentContext";

interface GraphqlProviderProps {
  children: React.ReactNode;
  authToken?: string;
}

/**
 * urql context provider to allow use of GraphQL queries with a useQuery() hook within the React component tree.
 * This hook supports SSR and React Suspense.
 */
export function GraphqlProvider(props: GraphqlProviderProps) {
  const { authToken } = useContext(EnvironmentContext);
  const [client, ssr] = useMemo(() => {
    return getReactClient(authToken);
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {props.children}
    </UrqlProvider>
  );
}
