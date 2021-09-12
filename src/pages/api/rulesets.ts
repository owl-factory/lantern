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
async function getRulesets(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);

  const rulesets = await RulesetLogic.fetchMany(req.body.ids, myUser);
  this.returnSuccess({ rulesets: rulesets });
}

export default createEndpoint({POST: getRulesets});
