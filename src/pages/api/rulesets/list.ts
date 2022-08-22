import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetList(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetLogic.searchAllRulesets();
  this.returnSuccess({ docs: rulesets });
}

export default createEndpoint({POST: getRulesetList});
