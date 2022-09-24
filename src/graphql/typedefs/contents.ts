import { gql } from "apollo-server-micro";

export const contentTypeDefs = gql`
  type Content {
    id: String
    name: String
    alias: String
    rulesetID: String
    ruleset: Ruleset
    contentTypeID: String
    contentType: contentType
    moduleID: String
    module: Module
    isPublic: Boolean
    fields: Json

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

  input ContentWhere {
    id: String
    rulesetID: String
    contentTypeID: String
  }

  input ContentInclude {
    ruleset: Boolean
    contentType: Boolean
    module: Boolean
  }

  input ContentCreateInput {
    name: String!
    alias: String
    rulesetID: String!
    contentTypeID: String!
    moduleID: String!
    isPublic: Boolean
  }

  input ContentMutateInput {
    name: String
    alias: String
    contentTypeID: String
    moduleID: String
    isPublic: Boolean
    fields: Json
  }

  Query {
    contents(where: ContentWhere, include: ContentInclude): [Content]
    content(id: String!, include: ContentInclude): Content
  }
  Mutation {
    createContent(content: ContentCreateInput!, include: ContentInclude): Content
    mutateContent(id: String!, content: ContentMutateInput!, include: ContentInclude): Content
  }
`;
