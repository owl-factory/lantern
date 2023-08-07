import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches a list of rulesets from their refs
 */
export async function getRulesets(req: NextApiRequest) {
  return { rulesets: [] };
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetsRequest(this: HTTPHandler, req: NextApiRequest) {
  const { rulesets } = await getRulesets(req);
  this.returnSuccess({ docs: rulesets });
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRulesets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Updates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateRulesets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Deletes a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function deleteRulesets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: getRulesetsRequest,
  PUT: createRulesets,
  PATCH: updateRulesets,
  DELETE: deleteRulesets,
});
