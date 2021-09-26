import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic, RulesetLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function setRulesetIsPublic(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const ruleset = await RulesetLogic.setPublic(req.query.id, req.body, myUser);
  this.returnSuccess({ ruleset: ruleset });
}

export default createEndpoint({POST: setRulesetIsPublic});
