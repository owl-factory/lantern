import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches a list of rulesets from their refs
 */
export async function getModules(req: NextApiRequest) {
  return { modules: [] };
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
  this.returnSuccess({ docs: [] });
}

/**
 * Updates modules
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateModules(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Deletes a module
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function deleteModules(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: getModulesRequest,
  PUT: createModules,
  PATCH: updateModules,
  DELETE: deleteModules,
});
