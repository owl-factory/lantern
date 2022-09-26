import { gql } from "apollo-server-micro";

export const campaignModuleTypeDefs = gql`
  type CampaignModule {
    campaignID: String
    campaign: Campaign
    moduleID: String
    module: Module
    sourceUserID: String
    sourceUser: User
  }

  # The where clause for *many queries
  input CampaignModuleWhere {
    campaignID: String
    moduleID: String
    sourceUserID: String
  }

  # Any additional modules to include in the response
  input CampaignModuleInclude {
    campaign: Boolean
    module: Boolean
  }

  type Query {
    campaignModules(where: CampaignModuleWhere, include: CampaignModuleInclude): [CampaignModule]
  }
`;
