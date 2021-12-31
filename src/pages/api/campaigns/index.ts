import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaigns(this: HTTPHandler, req: NextApiRequest) {
  const campaigns = await CampaignLogic.findMany(req.body.refs);
  this.returnSuccess({ docs: campaigns });
}

export default createEndpoint({POST: getCampaigns});
