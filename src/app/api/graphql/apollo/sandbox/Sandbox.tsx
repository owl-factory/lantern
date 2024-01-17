"use client";

import { ApolloSandbox } from "@apollo/sandbox/react";
import { baseUrl } from "utils/environment";

/**
 * Apollo sandbox client wrapper component.
 */
export function Sandbox() {
  const endpoint = baseUrl + "/api/graphql/apollo";
  return <ApolloSandbox className="h-full" initialEndpoint={endpoint} />;
}
