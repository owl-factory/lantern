import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";

/**
 * Fetches a single ruleset
 */
export async function getRulesets(req: NextApiRequest) {
  return { ruleset: {} };
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
  this.returnSuccess({ ruleset: {} });
}

export default createEndpoint({
  GET: getRulesetRequest,
  PATCH: updateRuleset,
});
