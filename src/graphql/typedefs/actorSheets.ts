import { gql } from "apollo-server-micro";

export const actorSheetTypeDefs = gql`

  type ActorSheet {
    id: String
    name: String

    rulesetID: String
    ruleset: Ruleset

    layout: String
    styling: String

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

  # The input for creating and mutating the actor sheet
  input ActorSheetInput {
    name: String
    layout: String
    styling: String
  }

  # The where clause for *many queries
  input ActorSheetWhere {
    id: String
    rulesetID: String
  }

  # Any additional documents to include in the response
  input ActorSheetInclude {
    ruleset: Boolean
  }

  type Query {
    actorSheets(where: ActorSheetWhere, include: ActorSheetInclude): [ActorSheet]
    actorSheet(id: String!, include: ActorSheetInclude): ActorSheet
  }
  type Mutation {
    createActorSheet(rulesetID: String!, include: ActorSheetInclude): ActorSheet
    mutateActorSheet(id: String!, actorSheet: ActorSheetInput!, include: ActorSheetInclude): ActorSheet
  }
`;
