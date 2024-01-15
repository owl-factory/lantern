import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";

const resolvers = {
  Query: {
    hello: () => "world",
  },
};

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

export const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});
