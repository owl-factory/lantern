import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { ImageLogic } from "server/logic/ImageLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { CampaignDocument } from "types/documents";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateCampaignBanner(this: HTTPHandler, req: NextApiRequest) {
// TODO - move this logic into the CampaignLogic
  const campaign = await CampaignLogic.findMyCampaign(req.query.ref as string);
  if (!campaign) { this.returnError(404, "Campaign not found."); return; }
  const image = await ImageLogic.create(req.body.method, req.body.image);
  if (!image) {  this.returnError(404, "Image not found."); return; }
  const campaignPatch: Partial<CampaignDocument> = { banner:
    { ref: image.ref, src: image.src },
  };
  const updatedCampaign = await CampaignLogic.updateBanner(campaign.ref, campaignPatch);

  this.returnSuccess({ campaign: updatedCampaign, image: image });
}

export default createEndpoint({PATCH: updateCampaignBanner});
