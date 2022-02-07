import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { CampaignLogic } from "server/logic/CampaignLogic";

export async function getDashboardPage(_req: NextApiRequest) {
  const campaigns = await CampaignLogic.fetchMyCampaigns({ size: 6 });
  return { campaigns: campaigns };
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getDashboardPageRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getDashboardPage(req));
}

export default createEndpoint({GET: getDashboardPageRequest});
