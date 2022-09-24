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

  # The input for creating and mutating the Actor
  input ActorInput {
    name: String
    actorTypeID: String;
    actorSheetID: String;
    isPublic: Boolean;
    publicAccess: String;
  }

  # Describes any additional documents
  input ActorInclude {
    ruleset: Boolean;
  }

  # The where clause for *many queries
  input ActorWhere {
    id: String;
    rulesetID: String;
  }

  Query {
    actors(where: ActorWhere, include: ActorInclude): [Actor]
    actor(id: String!, include: ActorInclude)
  }

  Mutate {
    createActor(actor: ActorInput!, include: ActorInclude): Actor
    mutateActor(id: String!, actor: ActorInput!, include: ActorInclude): Actor
  }
`;
