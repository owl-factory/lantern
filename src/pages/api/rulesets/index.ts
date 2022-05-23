import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches a list of rulesets from their refs
 */
export async function getRulesets(req: NextApiRequest) {
  const rulesets = await fetchMany(RulesetLogic.fetch, req.body.refs);
  return { rulesets };
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
  requirePermission("createRuleset");
  const rulesets = await createMany(RulesetLogic.create, req.body.docs);
  this.returnSuccess({ docs: rulesets });
}

/**
 * Updates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateRulesets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("updateRuleset");
  const rulesets = await updateMany(RulesetLogic.update, req.body.docs);
  this.returnSuccess({ docs: rulesets });
}

/**
 * Deletes a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function deleteRulesets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("deleteRuleset");
  const rulesets = await deleteMany(RulesetLogic.delete, req.body.refs);
  this.returnSuccess({ docs: rulesets });
}

export default createEndpoint({
  POST: getRulesetsRequest,
  PUT: createRulesets,
  PATCH: updateRulesets,
  DELETE: deleteRulesets,
});
