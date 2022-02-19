import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaigns(this: HTTPHandler, req: NextApiRequest) {
  const campaigns = await CampaignLogic.findManyOfMyCampaigns(req.body.refs);
  this.returnSuccess({ campaigns });
}

export default createEndpoint({POST: getCampaigns});
