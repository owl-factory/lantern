import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { UserLogic } from "server/logic/UserLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { getUniques } from "@owl-factory/utilities/arrays";
import { fetchMany } from "server/logic/many";

/**
 * Gets all of the information about the campaign and it's players
 */
export async function getCampaignPage(params: Record<string, unknown>) {
  const campaign = await CampaignLogic.fetch(params.ref as string);
  // TODO - remove this and instead store the player name in the campaign
  // campaign.players = await fetchMany(UserLogic.fetch, getUniques(campaign.players, "id"));

  return { campaign: campaign };
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPageRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getCampaignPage(req.query));
}

export default createEndpoint({GET: getCampaignPageRequest});
