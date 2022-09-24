import { gql } from "apollo-server-micro";

export const sceneTypeDefs = gql`
  type Scene {
    id: String
    name: String
    campaignID: String
    campaign: Campaign
    config: Json

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

  input SceneInclude {
    campaign: Boolean;
  }

  input SceneWhere {
    id: String
    campaignID: String
  }

  input SceneCreateInput {
    name: String!
  }
`;
