import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateCampaignBanner(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);

  const campaign = await CampaignLogic.fetchCampaign({ id: req.query.id as string, collection: "campaigns" }, myUser);
  if (!campaign) { this.returnError(404, "Campaign not found."); return; }
  const newImageAndCampaign = await CampaignLogic.updateBanner(campaign, req.body, myUser);

  this.returnSuccess({ campaign: newImageAndCampaign.campaign, image: newImageAndCampaign.image });
}

export default createEndpoint({PATCH: updateCampaignBanner});
