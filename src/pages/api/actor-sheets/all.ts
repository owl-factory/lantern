import "reflect-metadata";
import { NextApiRequest } from "next";

import { createEndpoint } from "@owl-factory/https/backend";
import { HTTPHandler } from "@owl-factory/https/backend";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetList(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({POST: getActorSheetList});
