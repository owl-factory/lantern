import { NextApiRequest, NextApiResponse } from "next";
import { RulesetResolver } from "../../../server/resolvers/RulesetResolver";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Fetches all rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetResolver.findOne(req.query.id as string);
  this.returnSuccess({ ruleset: ruleset });
}

/**
 * Deletes a single ruleset
 * @param this The handler class calling this function
 * @param req The request to delete in the server
 */
async function deleteRuleset(this: HTTPHandler, req: NextApiRequest) {
  const result = await RulesetResolver.deleteOne(req.query.id as string);
  this.returnSuccess({ result });
}

export default createEndpoint({ GET: getRuleset, DELETE: deleteRuleset });

