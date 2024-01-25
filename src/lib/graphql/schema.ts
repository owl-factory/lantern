import { gql } from "graphql-tag";
import { createSchema } from "graphql-yoga";
import { resolvers } from "lib/graphql/resolvers";

/**
 * GraphQL schema type definitions object.
 */
export const typeDefs = gql`
  type Todo {
    id: ID!
    description: String
    done: Boolean!
  }

  type Session {
    id: ID!
    user: User!
    activeExpires: String!
    idleExpires: String!
    isApiKey: Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    displayName: String
    iconUrl: String
  }

  type Query {
    todo(id: ID!): Todo!
    todos: [Todo!]!
    session: Session!
  }

  type Mutation {
    login(username: String, password: String, setCookie: Boolean): String!
    logout(deleteCookie: Boolean): String!
    createTodo(description: String, done: Boolean): Todo
    updateTodo(id: ID!, description: String, done: Boolean): Todo
    deleteTodo(id: ID!): ID!
  }
`;

export const schema = createSchema({
  typeDefs,
  resolvers,
});
