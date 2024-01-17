import gql from "graphql-tag";

/**
 * GraphQL schema type definitions object.
 */
export const typeDefs = gql`
  type Todo {
    id: ID!
    description: String
    done: Boolean
  }

  type Query {
    todo(id: ID): Todo
    todos: [Todo]
  }

  type Mutation {
    createTodo(description: String, done: Boolean): Todo
    updateTodo(id: ID!, description: String, done: Boolean): Todo
    deleteTodo(id: ID!): ID!
  }
`;
