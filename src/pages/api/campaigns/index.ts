import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaigns(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const campaigns = await CampaignLogic.findManyByIDs(req.body.ids);
  this.returnSuccess({ docs: campaigns });
}

export default createEndpoint({POST: getCampaigns});
