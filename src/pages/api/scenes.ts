import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { SceneLogic } from "server/logic/SceneLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";


/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createScene(this: HTTPHandler, req: NextApiRequest) {
  const campaign = await CampaignLogic.findByID(req.body.doc.campaign.ref);
  if (!campaign) {
    throw { code: 404, message: "The campaign does not exist" };
  }

  const scene = await SceneLogic.createOne(req.body.doc);
  this.returnSuccess({ doc: scene });
}

export default createEndpoint({
  PUT: createScene,
});
