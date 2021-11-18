import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function setRulesetIsPublic(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.updateIsPublic(req.query.id as string, req.body);
  this.returnSuccess({ ruleset: ruleset });
}

export default createEndpoint({PATCH: setRulesetIsPublic});
