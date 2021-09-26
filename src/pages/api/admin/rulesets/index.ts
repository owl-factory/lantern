import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { RulesetLogic } from "server/logic";
import { createEndpoint } from "server/utilities";
import { getMyUser } from "server/auth";
import { query as q } from "faunadb";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesets(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  const rulesets = await RulesetLogic.fetchOfficialRulesets([true], {}, myUser);

  this.returnSuccess({ rulesets: rulesets });
}

export default createEndpoint({GET: getRulesets});
