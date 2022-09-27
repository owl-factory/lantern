import { gql } from "apollo-server-micro";

export const campaignAccessLinkTypeDefs = gql`
  type CampaignAccessLink {
    id: String
    campaignID: String
    campaign: Campaign
    linkKey: String
    expiresAt: Date
    access: UserCampaignAccess # See campaignAccess for this enum
    uses: Int
    maximumUses: Int

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

  type Mutation: {
    joinCampaign(campaignID: String!, linkKey: String!): Campaign
  }
`;
