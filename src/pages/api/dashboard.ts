import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { CampaignLogic } from "server/logic/CampaignLogic";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getDashboardPage(this: HTTPHandler, _req: NextApiRequest) {
  const campaigns = await CampaignLogic.fetchMyCampaigns({ size: 6 });
  this.returnSuccess({ campaigns: campaigns });
}

export default createEndpoint({GET: getDashboardPage});
