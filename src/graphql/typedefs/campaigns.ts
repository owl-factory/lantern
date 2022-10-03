import { gql } from "apollo-server-micro";

export const campaignTypeDefs = gql`
  type Campaign {
    id: String
    name: String
    rulesetID: String
    ruleset: Ruleset
    bannerID: String
    banner: Asset
    bannerSrc: String

    lastPlayedAt: Date
    playtime: Int

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
  input CampaignInclude {
    ruleset: Boolean
    banner: Boolean
  }

  # The where clause of the original documents
  input CampaignWhere {
    id: String
    rulesetID: String
  }

  # Describes the fields for creating a campaign
  input CampaignCreateInput {
    name: String!
    rulesetID: String!
  }

  # Describes the fields for mutating a campaign
  input CampaignMutateInput {
    name: String
    rulesetID: String
    bannerID: String
  }

  type Query {
    campaigns(where: CampaignWhere, include: CampaignInclude): [Campaign]
    campaign(id: String!, include: CampaignInclude): Campaign
  }
  type Mutation {
    createCampaign(campaign: CampaignCreateInput!, include: CampaignInclude): Campaign
    mutateCampaign(id: String!, campaign: CampaignMutateInput!, include: CampaignInclude): Campaign
  }
`;
