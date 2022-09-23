import { Campaign } from "@prisma/client";
import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include
interface CampaignInclude {
  ruleset: boolean;
  banner: boolean;
}

// There where clause for *many queries
interface CampaignWhere {
  id?: string;
  rulesetID?: string;
}

// The inputs for creating a new campaign
interface CampaignCreateInput {
  name: string;
  rulesetID: string;
}

interface CampaignMutateInput {
  name?: string;
  rulesetID?: string;
  bannerID?: string | null;
}

interface GetCampaignsArguments {
  where: CampaignWhere;
  include: CampaignInclude;
}

interface GetCampaignArgument {
  id: string;
  include: CampaignInclude;
}

interface CreateCampaignArguments {
  campaign: CampaignCreateInput;
  include: CampaignInclude;
}

interface MutateCampaignArguments {
  id: string;
  campaign: CampaignMutateInput;
  include: CampaignInclude;
}

/**
 * Gets many campaigns
 * @param include The additional documents to include
 * @returns A list of campaigns
 */
async function getCampaigns(_: unknown, { where, include }: GetCampaignsArguments) {
  return prisma.campaign.findMany({ where, include });
}

/**
 * Fetches a single campaign
 * @param id The ID of the campaign to fetch
 * @param include The additional documents to include
 * @returns A single campaign
 */
async function getCampaign(_: unknown, { id, include }: GetCampaignArgument) {
  return prisma.campaign.findUnique({ where: { id }, include });
}

/**
 * Creates a single campaign
 * @param campaign The campaign to create
 * @param include Additional documents to include
 * @returns The created campaign
 */
async function createCampaign(_: unknown, { campaign, include }: CreateCampaignArguments) {
  const ruleset = await prisma.ruleset.findUnique({ where: { id: campaign.rulesetID }});
  if (!ruleset) { throw "Error"; }

  return prisma.campaign.create({
    data: {
      name: campaign.name,
      ruleset: { connect: { id: campaign.rulesetID }},
      lastPlayedAt: new Date(),
      playtime: 0,
    },
    include,
  });
}

/**
 * Mutates a single campaign
 * @param id The ID of the campaign to mutate
 * @param campaign The changed fields of the campaign
 * @param include The additional documents to return
 * @returns The mutated campaign
 */
async function mutateCampaign(_: unknown, { id, campaign, include }: MutateCampaignArguments) {
  const bannerID = campaign.bannerID;
  let ruleset;
  if (campaign.rulesetID) {
    ruleset = await prisma.ruleset.findUnique({ where: { id: campaign.rulesetID }});
    if (!ruleset) { throw "Error"; }
  }

  let banner;
  if (campaign.bannerID) {
    banner = await prisma.file.findUnique({ where: { id: campaign.bannerID }});
    if (!banner) { throw "Error"; }
  }

  delete campaign.rulesetID;
  delete campaign.bannerID;

  return prisma.campaign.update({
    data: {
      ...campaign as any,
      ruleset: ruleset ? { connect: { id: ruleset.id }} : undefined,
      banner: banner ? { connect: { id: banner.id }} : bannerID,
      bannerSrc: banner ? banner.src : bannerID, // Banner ID should be null or undefined
    },
    where: { id },
    include,
  });
}

export const campaignResolvers = {
  Query: {
    campaigns: getCampaigns,
    campaign: getCampaign,
  },
  Mutate: {
    createCampaign,
    mutateCampaign,
  },
};
