import { NextApiRequest } from "next";
import { getMyUser } from "server/auth";
import { RulesetLogic } from "server/logic/RulesetLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetLogic.findByID(req.query.id as string);
  this.returnSuccess({ ruleset: ruleset });
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateRuleset(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);

  const ruleset = await RulesetLogic.createOne(req.body);
  this.returnSuccess({ ruleset });
}

export default createEndpoint({
  GET: getRuleset,
  PATCH: updateRuleset,
});
