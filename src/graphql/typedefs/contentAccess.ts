import { gql } from "apollo-server-micro";

export const contentAccessTypeDefs = gql`
  enum ContentAccessLevels {
    AWARE
    VIEW
    EDIT
    FULL
  }

  type ContentAccess {
    userID: String
    user: User
    contentID: String
    content: Content
    access: ContentAccessLevels
  }

  # Any additional documents to include in the response
  input ContentAccessInclude {
    user: Boolean
    content: Boolean
  }

  # The where clause for *many queries
  input ContentAccessWhere {
    userID: String
    contentID: String
  }

  # Describes the fields to create a new content access
  input ContentAccessCreateInput {
    contentID: String!
    userID: String!
    access: ContentAccessLevels
  }

  # Describes the fields to mutate existing content access
  input ContentAccessMutateInput {
    access: ContentAccessLevels
  }

  type Query {
    contentAccess(where: ContentAccessWhere, include: ContentAccessInclude): [ContentAccess]
  }
  type Mutation {
    createContentAccess(contentAccess: ContentAccessCreateInput!, include: ContentAccessInclude): ContentAccess
    mutateContentAccess(
      id: String!,
      contentAccess: ContentAccessMutateInput!,
      include: ContentAccessInclude
    ): ContentAccess
  }
`;
