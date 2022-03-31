import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { fetchMany } from "server/logic/many";

/**
 * Fetches a list of rulesets from their refs
 */
export async function getRulesets(req: NextApiRequest) {
  const rulesets = await fetchMany(RulesetLogic.fetch, req.body.refs);
  return { rulesets };
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetsRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getRulesets(req));
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.create(req.body);
  this.returnSuccess({ ruleset });
}

export default createEndpoint({
  POST: getRulesetsRequest,
  PUT: createRuleset,
});
