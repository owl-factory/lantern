import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { RulesetLogic } from "server/logic";
import { createEndpoint } from "server/utilities";
import { getMyUser } from "server/auth";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesets(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetLogic.searchRulesetsByOfficial(true);

  this.returnSuccess({ rulesets: rulesets });
}

export default createEndpoint({GET: getRulesets});
