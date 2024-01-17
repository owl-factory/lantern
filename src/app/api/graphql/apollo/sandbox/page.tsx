import { Sandbox } from "app/api/graphql/apollo/sandbox/Sandbox";
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
  return <Sandbox />;
}

export default Page;
