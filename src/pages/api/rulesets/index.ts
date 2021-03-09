import { NextApiRequest, NextApiResponse } from "next";
import { RulesetResolver } from "../../../server/resolvers/RulesetResolver";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Fetches a subset of all matching rulesets and the total count of rulesets matching the filters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function fetchRulesets(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetResolver.findMany(req.body.filters, req.body.options);
  const rulesetCount = await RulesetResolver.findCount(req.body.filters);
  this.returnSuccess({
    rulesets: rulesets,
    rulesetCount: rulesetCount,
  });
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRuleset(this: HTTPHandler, req: NextApiRequest) {
  // const ruleset = await RulesetResolver.createOne(req.body);
  // this.returnSuccess({ ruleset });
}
 
export default createEndpoint({GET: fetchRulesets, POST: fetchRulesets, PUT: createRuleset});
