import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";

/**
 * Gets a list of the current user's contents
 */
export async function getMyContent(_req: NextApiRequest) {
  return { contents: [] };
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyContentRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getMyContent(req));
}

export default createEndpoint({GET: getMyContentRequest});
