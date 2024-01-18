import { createYoga } from "graphql-yoga";
import { schema } from "lib/graphql/schema";

/**
 * GraphQL Yoga instance with our schema.
 */
export const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});
