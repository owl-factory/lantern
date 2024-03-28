import type { Resolvers } from "types/graphql";
import { mutations } from "services/graphql/mutations";
import { queries } from "services/graphql/queries";
import { scalars } from "services/graphql/scalars";

/**
 * Full GraphQL resolver map of all resolvers in the schema.
 */
export const resolvers: Resolvers = {
  Query: queries,
  Mutation: mutations,
  ...scalars,
};
