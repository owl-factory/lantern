import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

interface CampaignAccessWhere {
  userID?: string;
  campaignID?: string;
}

interface CampaignAccessInclude {
  user?: boolean;
  campaign?: boolean;
}

interface GetCampaignAccessArguments {
  where: CampaignAccessWhere;
  include: CampaignAccessInclude;
}

/**
 * Fetches campaign access documents
 * @param where the where clause of the campaign access query
 * @param include Any additional documents to include
 * @returns A list of campaign access documents
 */
async function getCampaignAccess(_: unknown, { where, include }: GetCampaignAccessArguments) {
  return prisma.campaignAccess.findMany({ where, include });
}

export const campaignAccessResolvers = {
  Query: {
    campaignAccess: getCampaignAccess,
  },
};
