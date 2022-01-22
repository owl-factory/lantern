import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesets(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetLogic.findManyByIDs(req.body.refs);
  this.returnSuccess({ docs: rulesets });
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.createOne(req.body);
  this.returnSuccess({ ruleset });
}

export default createEndpoint({
  POST: getRulesets,
  PUT: createRuleset,
});
