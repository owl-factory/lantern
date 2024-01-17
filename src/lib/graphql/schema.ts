import { createSchema } from "graphql-yoga";
import { typeDefs } from "lib/graphql/typeDefs";
import { resolvers } from "lib/graphql/resolvers";

export const schema = createSchema({
  typeDefs,
  resolvers,
});
