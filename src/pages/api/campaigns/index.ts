import { NextApiRequest } from "next";
import { CampaignLogic, authenticateUser } from "server";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createCampaign(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const campaign = await CampaignLogic.createCampaign(user._id, req.body);
  this.returnSuccess({campaign});
}

export default createEndpoint({PUT: createCampaign});
