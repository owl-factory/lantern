import type { Resolvers } from "generated/resolvers-types";
import { mutations } from "services/graphql/mutations";
import { queries } from "services/graphql/queries";

/**
 * Resolver map of all resolvers for the GraphQL schema.
 */
export const resolvers: Resolvers = {
  Query: queries,
  Mutation: mutations,
};
