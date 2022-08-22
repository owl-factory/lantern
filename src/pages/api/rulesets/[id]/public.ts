import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function setRulesetIsPublic(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.updateOfficialRulesetIsPublic(req.query.id as string, req.body);
  this.returnSuccess({ ruleset: ruleset });
}

export default createEndpoint({PATCH: setRulesetIsPublic});
