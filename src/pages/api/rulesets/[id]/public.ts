import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function setRulesetIsPublic(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ ruleset: {} });
}

export default createEndpoint({PATCH: setRulesetIsPublic});
