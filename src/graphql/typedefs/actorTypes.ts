import { gql } from "apollo-server-micro";

export const actorTypeTypeDefs = gql`
  type ActorType {
    id: String
    name: String
    baseActorType: String
    rulesetID: String
    ruleset: Ruleset

    defaultActorSheetID: String
    defaultActorSheet: ActorSheet

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

  # The where clause for *many queries
  input ActorTypeWhere {
    id: String
    rulesetID: String
    defaultActorSheetID: String
  }

  # Any additional documents to include in the response
  input ActorTypeInclude {
    ruleset: Boolean;
  }

  # Describes the fields used to create the actor type
  input ActorTypeCreateInput {
    name: String!
    baseActorType: String!
    rulesetID: String!
    defaultActorSheetID: String!
  }

  # Describes the fields used to mutate an actor type
  input ActorTypeMutateInput {
    name: String
    baseActorType: String
    defaultActorTypeID: String
  }

  Query {
    actorTypes(where: ActorTypeWhere, include: ActorTypeInclude): [ActorType]
    actorType(id: String!, include: ActorTypeInclude): ActorType
  }
  Mutation {
    createActorType(actorType: ActorTypeCreateInput!, include: ActorTypeInclude): ActorType
    mutateActorType(id: String!, actorType: ActorTypeMutateInput!, include: ActorTypeInclude): ActorType
  }
`;
