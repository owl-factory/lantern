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

  # Any additional documents to include in the response
  input SceneInclude {
    campaign: Boolean;
  }

  # The where clause of the *many queries
  input SceneWhere {
    id: String
    campaignID: String
  }

  # Fields used for the creation of a scene
  input SceneCreateInput {
    name: String!
    campaignID: String!
    config: Json
  }

  # Fields used for the mutation of a scene
  input SceneMutateInput {
    name: String
    campaignID: String
    config: Json
  }

  type Query {
    scenes(where: SceneWhere, include: SceneInclude): [Scene]
    scene(id: String!, include: SceneInclude): Scene
  }
  type Mutation {
    createScene(scene: SceneCreateInput!, include: SceneInclude): Scene
    mutateScene(id: String!, scene: SceneMutateInput!, include: SceneInclude): Scene
  }
`;
