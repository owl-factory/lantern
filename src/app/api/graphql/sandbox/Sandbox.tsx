"use client";

import { ApolloSandbox } from "@apollo/sandbox/react";

/**
 * Apollo sandbox client wrapper component.
 */
export function Sandbox() {
  return <ApolloSandbox className="h-full" initialEndpoint="http://localhost:3000/api/graphql" />;
}
