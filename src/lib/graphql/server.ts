import { ApolloServer } from "@apollo/server";
import { createYoga } from "graphql-yoga";
import { schema } from "lib/graphql/schema";

/**
 * Apollo server instance that is served at '/api/graphql'.
 * We may switch to GraphQL Yoga. https://the-guild.dev/graphql/yoga-server/docs
 */
export const apolloServer = new ApolloServer({
  schema,
  introspection: true,
});

/**
 * GraphQL Yoga instance with our schema.
 */
export const yoga = createYoga({ schema });
