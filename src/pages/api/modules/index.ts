import "reflect-metadata";
import { NextApiRequest } from "next";
import { RulesetLogic } from "server/logic/RulesetLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";
import { requireLogin, requirePermission } from "utilities/validation/account";
import { ModuleLogic } from "server/logic/ModuleLogic";

/**
 * Fetches a list of rulesets from their refs
 */
export async function getModules(req: NextApiRequest) {
  const modules = await fetchMany(ModuleLogic.fetch, req.body.refs);
  return { modules };
}

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getModulesRequest(this: HTTPHandler, req: NextApiRequest) {
  const { modules } = await getModules(req);
  this.returnSuccess({ docs: modules });
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

/**
 * Updates modules
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateModules(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("updateModule");
  const modules = await updateMany(ModuleLogic.update, req.body.docs);
  this.returnSuccess({ docs: modules });
}

/**
 * Deletes a module
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function deleteModules(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("deleteModule");
  const modules = await deleteMany(ModuleLogic.delete, req.body.refs);
  this.returnSuccess({ docs: modules });
}

export default createEndpoint({
  POST: getModulesRequest,
  PUT: createModules,
  PATCH: updateModules,
  DELETE: deleteModules,
});
