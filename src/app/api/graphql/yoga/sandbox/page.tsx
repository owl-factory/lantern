import { Sandbox } from "app/api/graphql/Sandbox";
import { Metadata } from "next";
import { baseUrl } from "utils/environment";

/**
 * Page metadata object, NextJs will append these values as meta tags to the <head>.
 */
export const metadata: Metadata = {
  title: "GraphQL Sandbox (Yoga)",
  description: "Welcome Lantern's GraphQL API Sandbox, backed by Yoga.",
};

/**
 * /api/graphql:
 * GraphQL Sandbox page component.
 */
function Page() {
  return <Sandbox endpoint={baseUrl + "/api/graphql/yoga"} />;
}

export default Page;
