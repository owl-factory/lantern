import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { SceneLogic } from "server/logic/SceneLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";


/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createScene(this: HTTPHandler, req: NextApiRequest) {
  const campaign = CampaignLogic.fetch(req.body.campaignID);
  if (!campaign) {
    throw { code: 404, message: "The campaign does not exist" };
  }

  const scene = await SceneLogic.createScene(req.body);
  this.returnSuccess({ scene });
}

export default createEndpoint({
  PUT: createScene,
});
