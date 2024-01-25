import { authenticationResolvers } from "services/graphqlResolvers/authentication";
import { todoResolvers } from "services/graphqlResolvers/todo";

/**
 * Resolver map of all resolvers for the GraphQL schema.
 */
export const resolvers = {
  Query: {
    ...authenticationResolvers.Query,
    ...todoResolvers.Query,
  },
  Mutation: {
    ...authenticationResolvers.Mutation,
    ...todoResolvers.Mutation,
  },
};
