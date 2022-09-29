import { gql } from "apollo-server-micro";

export const actorTypeDefs = gql`
  enum ActorPublicAccess {
    AWARE, # Users can see that these exist, but cannot see their detailed information
    VIEW,  # Users can see the details of the actor
  }

  type Actor {
    id: String
    name: String

    rulesetID: String
    ruleset: Ruleset

    actorTypeID: String
    actorType: ActorType

    actorSheetID: String
    actorSheet: ActorSheet

    campaignID: String
    campaign: Campaign

    isPublic: Boolean
    publicAccess: String

    fields: Json
    content: Json

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

  input ActorCreateInput {
    name: String!
    rulesetID: String!
    actorTypeID: String!
    isPublic: Boolean
    publicAccess: String
  }

  # The input for mutating the Actor
  input ActorMutateInput {
    name: String
    actorTypeID: String
    actorSheetID: String
    fields: Json
    content: Json
    isPublic: Boolean
    publicAccess: String
  }

  # Describes any additional documents
  input ActorInclude {
    ruleset: Boolean
    actorType: Boolean
    actorSheet: Boolean
  }

  # The where clause for *many queries
  input ActorWhere {
    id: String
    rulesetID: String
  }

  type Query {
    actors(where: ActorWhere, include: ActorInclude): [Actor]
    actor(id: String!, include: ActorInclude): Actor
  }

  type Mutation {
    createActor(actor: ActorCreateInput!, include: ActorInclude): Actor
    mutateActor(id: String!, actor: ActorMutateInput!, include: ActorInclude): Actor
    deleteActor(id: String!, softDelete: Boolean): Boolean
  }
`;
