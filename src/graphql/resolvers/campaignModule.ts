import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

interface CampaignModuleWhere {
  campaignID?: string;
  moduleID?: string;
  sourceUserID?: string;
}

interface CampaignModuleInclude {
  campaign: boolean;
  module: boolean;
}

interface GetCampaignModulesArguments {
  where: CampaignModuleWhere;
  include: CampaignModuleInclude;
}

/**
 * Gets campaign modules
 * @param where The where clause for searching
 * @param include Any additional documents to include when fetching the campaign modules
 * @returns A list of campaign modules
 */
async function getCampaignModules(_: unknown, { where, include }: GetCampaignModulesArguments) {
  return prisma.campaignModule.findMany({
    where,
    include,
  });
}

export const campaignModuleResolver = {
  Query: {
    campaignModules: getCampaignModules,
  },
};
