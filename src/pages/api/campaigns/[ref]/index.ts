import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Gets all of the information about the campaign and it's players
 */
export async function getCampaignPage(params: Record<string, unknown>) {
  return { campaign: {} };
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
