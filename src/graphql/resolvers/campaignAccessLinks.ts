import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

interface JoinCampaignArguments {
  campaignID: string;
  linkKey: string;
}

async function joinCampaign(_: unknown, { campaignID, linkKey }: JoinCampaignArguments) {
  // TODO - get user
  const campaignAccessLink = await prisma.campaignAccessLink.findFirst({
    where: {
      campaignID,
      linkKey,
    },
  });
  // TODO - checking
  if (!campaignAccessLink) { throw "The campaign or link key are invalid"; }
}

export const campaignAccessLinkResolvers = {
  Query: {
    joinCampaign,
  },
};
