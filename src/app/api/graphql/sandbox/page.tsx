"use client";

import { ApolloSandbox } from "@apollo/sandbox/react";
import { Metadata } from "next";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "GraphQL Sandbox",
  description: "Welcome Lantern's GraphQL API Sandbox.",
};

/**
 * /api/graphql:
 * GraphQL Sandbox page component.
 */
function Page() {
  return <ApolloSandbox className="h-full" initialEndpoint="http://localhost:3000/api/graphql" />;
}

export default Page;
