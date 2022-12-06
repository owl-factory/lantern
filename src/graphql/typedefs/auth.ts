import { gql } from "apollo-server-micro";

export const authTypeDefs = gql`
  input PasswordSignUpInput {
    username: String!
    email: String!
    password: String!
    passwordConfirmation: String!
  }

  type Mutation {
    passwordSignIn(username: String!, password: String!): String
    passwordSignUp(userSecret: PasswordSignUpInput!): String
  }
`;
