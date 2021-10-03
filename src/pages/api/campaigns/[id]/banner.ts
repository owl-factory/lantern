import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic, ImageLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { CampaignDocument } from "types/documents";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateCampaignBanner(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);

  const campaign = await CampaignLogic.fetch(req.query.id, myUser);
  if (!campaign) { this.returnError(404, "Campaign not found."); return; }
  const image = await ImageLogic.create(req.body.image, req.body.method, myUser);
  if (!image) {  this.returnError(404, "Image not found."); return; }
  const campaignPatch: Partial<CampaignDocument> = { banner:
    { id: image.id, collection: image.collection, ref: image.ref, src: image.src },
  };
  const updatedCampaign = await CampaignLogic.updateBanner(campaign.id, campaignPatch, myUser);

  this.returnSuccess({ campaign: updatedCampaign, image: image });
}

export default createEndpoint({PATCH: updateCampaignBanner});
