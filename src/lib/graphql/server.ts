import { ApolloServer } from "@apollo/server";
import { resolvers } from "lib/graphql/resolvers";
import { typeDefs } from "lib/graphql/typeDefs";

/**
 * Apollo server instance that is served at '/api/graphql'.
 * We may switch to GraphQL Yoga. https://the-guild.dev/graphql/yoga-server/docs
 */
export const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});
