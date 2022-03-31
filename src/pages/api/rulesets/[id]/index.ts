import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Fetches a single ruleset
 */
export async function getRulesets(req: NextApiRequest) {
  const ruleset = await RulesetLogic.fetch(req.query.id as string);
  return { ruleset: ruleset };
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getRulesets(req));
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.create(req.body);
  this.returnSuccess({ ruleset });
}

export default createEndpoint({
  GET: getRulesetRequest,
  PATCH: updateRuleset,
});
