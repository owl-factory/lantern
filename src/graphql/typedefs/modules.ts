import { gql } from "apollo-server-micro";

export const modulesTypeDefs = gql`
  type Module {
    id: String
    name: String
    alias: String
    rulesetID: String
    ruleset: Ruleset
    isOfficial: Boolean
    isPublished: Boolean
    publishAccess: ModuleAccessValue # Refer to the ModuleAccess.ts

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
  input ModuleInclude {
    ruleset: Boolean
  }

  # The where clause of the module *many queries
  input ModuleWhere {
    id: String
    rulesetID: String
  }

  # Describes the fields used to create a module
  input ModuleCreateInput {
    name: String!
    alias: String
    rulesetID: String
    isOfficial: Boolean
    isPublished: Boolean
    publishAccess: String
  }

  # Describes the fields used to mutate and existing module
  input ModuleMutateInput {
    name: String
    alias: String
    isOfficial: Boolean
    isPublished: Boolean
    publishAccess: String
  }

  Query {
    modules(where: ModuleWhere, include: ModuleInclude): [Module]
    module(id: String!, include: ModuleInclude): Module
  }
  Mutation {
    createModule(module: ModuleCreateInput!, include: ModuleInclude): Module
    mutateModule(id: String!, module: ModuleMutateInput!, include: ModuleInclude): Module
  }
`;
