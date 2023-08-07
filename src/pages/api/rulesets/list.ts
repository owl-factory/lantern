import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetList(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({POST: getRulesetList});
