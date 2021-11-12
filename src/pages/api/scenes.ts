import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic, RulesetLogic } from "server/logic";
import { SceneLogic } from "server/logic/SceneLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";


/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createScene(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);

  const campaign = CampaignLogic.findByID(req.body.campaignID);
  if (!campaign) {
    throw { code: 404, message: "The campaign does not exist" };
  }

  const scene = await SceneLogic.create(req.body, myUser);
  this.returnSuccess({ scene });
}

export default createEndpoint({
  PUT: createScene,
});
