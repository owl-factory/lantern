import { gql } from "apollo-server-micro";

export const contentRelationTypeDefs = gql`
  type ContentRelation {
    parentID: String
    parent: Content
    childID: String
    child: Content
  }

  Mutation {
    createContentRelation(parentID: String!, childID: String!): ContentRelation
  }
`;
