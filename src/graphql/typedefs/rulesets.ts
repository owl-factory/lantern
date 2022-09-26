import { gql } from "apollo-server-micro";

export const rulesetTypeDefs = gql`
  type Ruleset {
    id: String
    name: String
    alias: String
    isOfficial: Boolean
    isPublished: Boolean
    actorFields: Json
    rules: Json

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

    campaigns: [Campaign]
    modules: [Module]
    contentTypes: [ContentType]
    contents: [Content]
    actorTypes: [ActorType]
    actors: [Actor]
    actorSheets: [ActorSheet]
  }

  # Any additional documents to include in the response
  input RulesetInclude {
    id: Boolean
  }

  # The where clause for the ruleset *many queries
  input RulesetWhere {
    id: String,
  }

  # Fields used for the creation of rulesets
  input RulesetCreateInput {
    name: String!
    alias: String
    isOfficial: Boolean
    isPublished: Boolean
    actorFields: Json
    rules: Json
  }

  # Fields used for the mutation of rulesets
  input RulesetMutateInput {
    name: String
    alias: String
    isOfficial: Boolean
    isPublished: Boolean
    actorFields: Json
    rules: Json
  }

  type Query {
    rulesets(where: RulesetWhere, include: RulesetInclude): [Ruleset]
    ruleset(id: String!, include: RulesetInclude): Ruleset
  }
  type Mutation {
    createRuleset(ruleset: RulesetCreateInput!, include: RulesetInclude): Ruleset
    mutateRuleset(id: String!, ruleset: RulesetMutateInput!, include: RulesetInclude): Ruleset
  }
`;
