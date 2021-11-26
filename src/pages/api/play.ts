import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { ContentLogic } from "server/logic/ContentLogic";
import { RulesetLogic } from "server/logic/RulesetLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getGame(this: HTTPHandler, req: NextApiRequest) {
  const campaign = await CampaignLogic.findByID(req.body.ref);
  const ruleset = await RulesetLogic.findByID(campaign.ruleset.ref);
  this.returnSuccess({ campaign: campaign, ruleset: ruleset });
}

export default createEndpoint({POST: getGame});
