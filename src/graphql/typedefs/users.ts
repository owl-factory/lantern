import { gql } from "apollo-server-micro";

export const userTypeDefs = gql`
  type User {
    id: String
    username: String
    displayName: String
    avatarSrc: String
    storageUsed: Int
    
    createdAt: Date
    updatedAt: Date

    ownedCampaigns: [Campaign]
    ownedRulesets: [Ruleset]
    ownedModules: [Module]
    sharedCampaignModules: [CampaignModule]
    ownedActors: [Actor]
    ownedActorSheets: [ActorSheet]
    ownedContents: [Content]
    ownedAssets: [Asset]

    campaignAccess: [CampaignAccess]
    moduleAccess: [ModuleAccess]
    contentAccess: [ContentAccess]
  }

  # The where clause of the user *many queries
  input UserWhere {
    id: String
    username: String
  }

  # Any additional documents to include in the response
  input UserInclude {
    moduleAccess: Boolean
    contentAccess: Boolean
  }

  type Query {
    users(where: UserWhere, include: UserInclude): [User]
    user(id: String!, include: UserInclude): User
  }
`;
