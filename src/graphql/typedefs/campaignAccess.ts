import { gql } from "apollo-server-micro";

export const campaignAccessTypeDefs = gql`
  # Describes the different kinds of access usable in CampaignAccess documents
  enum UserCampaignAccess {
    PLAYER
    GM
  }

  type CampaignAccess {
    userID: String
    user: User
    campaignID: String
    campaign: Campaign
    access: UserCampaignAccess
  }

  # The where clause for *many queries
  input CampaignAccessWhere {
    userID: String
    campaignID: String
  }

  # Any additional documents to include in the response
  input CampaignAccessInclude {
    user: Boolean
    campaign: Boolean
  }

  type Query {
    campaignAccess(where: CampaignAccessWhere, include: CampaignAccessInclude): [CampaignAccess]
  }
`;
