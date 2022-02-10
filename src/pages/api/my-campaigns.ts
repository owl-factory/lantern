import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { getUniques } from "@owl-factory/utilities/arrays";
import { findMany } from "server/logic/many";

/**
 * Fetches all of the current user's campaigns
 * @param _req The request to the server. Unused but required for handleAPI
 */
export async function getMyCampaigns(_req: NextApiRequest) {
  const fetchedCampaigns = await CampaignLogic.fetchMyCampaigns({ size: 20 });
  const ids = getUniques(fetchedCampaigns, "ref");
  const campaigns = await findMany(CampaignLogic.findMyCampaign, ids);
  return { campaigns: campaigns };
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCampaignsRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getMyCampaigns(req));
}

export default createEndpoint({GET: getMyCampaignsRequest});
