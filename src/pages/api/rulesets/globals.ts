import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getGlobalRulesets(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetLogic.searchRulesetsByOfficialPublic(true, true);
  this.returnSuccess({ rulesets: rulesets });
}

export default createEndpoint({
  GET: getGlobalRulesets,
});
