import { createSchema, createYoga } from "graphql-yoga";
import { resolvers } from "services/graphql/resolvers";
import { graphqlUrl } from "utils/environment";

const typeDefs = process.env.GRAPHQL_TYPEDEFS ?? "";

/**
 * GraphQL schema object made up of all resolvers from `services` and the typeDefs string read in from an environment variable.
 */
export const schema = createSchema({
  typeDefs,
  resolvers,
});

/**
 * GraphQL Yoga instance with our schema.
 */
export const yoga = createYoga({
  schema,
  graphqlEndpoint: graphqlUrl,
  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Request, Response },
  graphiql: false,
});
