import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, fetchMany } from "server/logic/many";
import { requireLogin, requirePermission } from "utilities/validation/account";
import { ModuleLogic } from "server/logic/ModuleLogic";

/**
 * Fetches a list of rulesets from their refs
 */
export async function getModules(req: NextApiRequest) {
  const rulesets = await fetchMany(RulesetLogic.fetch, req.body.refs);
  return { rulesets };
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getModulesRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getModules(req));
}

/**
 * Creates a ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createModules(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("createModule");
  const modules = await createMany(ModuleLogic.create, req.body.docs);
  this.returnSuccess({ docs: modules });
}

export default createEndpoint({
  POST: getModulesRequest,
  PUT: createModules,
});
