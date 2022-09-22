import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Fetches the given contents
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentList(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({POST: getContentList});
