import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { ModuleLogic } from "server/logic/ModuleLogic";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getModuleList(this: HTTPHandler, req: NextApiRequest) {
  const modules = await ModuleLogic.searchAllModules();
  this.returnSuccess({ docs: modules });
}

export default createEndpoint({POST: getModuleList});
