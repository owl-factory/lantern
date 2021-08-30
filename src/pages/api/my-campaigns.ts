import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCampaigns(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const fetchedCampaigns = await CampaignLogic.fetchMyCampaigns([], { size: 20 }, myUser);
  const campaigns = await CampaignLogic.fetchMany(fetchedCampaigns, myUser);
  this.returnSuccess({ campaigns: campaigns });
}

export default createEndpoint({GET: getMyCampaigns});
