import { gql } from "apollo-server-micro";

export const contentTypeTypeDefs = gql`
  type ContentType {
    id: String
    name: String
    icon: String
    contentFields: Json
    viewLayout: String
    viewStyling: String
    searchLayout: String
    resultLayout: String
    searchStyling: String

    ownedBy: String
    owner: User
    createdAt: Date
    createdBy: String
    creatingUser: User
    updatedAt: Date
    updatedBy: String
    updatingUser: User
    deletedAt: Date
    deletedBy: String
    deletingUser: User
  }

  # Any additional documents to include in the response
  input ContentTypeInclude {
    ruleset: Boolean
  }

  # The where clause of the *many queries
  input ContentTypeWhere {
    id: String
    rulesetID: String
  }

  # The fields used to create a content type
  input ContentTypeCreateInput {
    name: String!
    alias: String
    icon: String!
    contentFields: Json
    viewLayout: String
    viewStyling: String
    searchLayout: String
    resultLayout: String
    searchStyling: String
  }

  # The fields used to mutate an existing content type
  input ContentTypeMutateInput {
    name: String
    alias: String
    icon: String
    contentFields: Json
    viewLayout: String
    viewStyling: String
    searchLayout: String
    resultLayout: String
    searchStyling: String
  }

  type Query {
    contentTypes(where: ContentTypeWhere, include: ContentTypeInclude): [ContentType]
    contentType(id: String!, include: ContentTypeInclude): Content
  }
  type Mutation {
    createContentType(
      rulesetID: String!,
      contentType: ContentTypeCreateInput!,
      include: ContentTypeInclude
    ): ContentType
    mutateContentType(id: String!, contentType: ContentTypeMutateInput!, include: ContentTypeInclude): ContentType
  }
`;
