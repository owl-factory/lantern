import "reflect-metadata";
import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { RulesetLogic } from "server/logic/RulesetLogic";

/**
 * Gets a list of rulesets for the admin rulesets page
 */
export async function getAdminRulesets(_req: NextApiRequest) {
  const rulesets = await RulesetLogic.searchRulesetsByOfficial(true);

  return { rulesets: rulesets };
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetsRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getAdminRulesets(req));
}

export default createEndpoint({GET: getRulesetsRequest});
