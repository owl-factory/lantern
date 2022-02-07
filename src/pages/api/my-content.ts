import "reflect-metadata";
import { NextApiRequest } from "next";
import { ContentLogic } from "server/logic/ContentLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

export async function getMyContent(_req: NextApiRequest) {
  const contents = await ContentLogic.searchMyContent({ size: 20 });
  return { contents: contents };
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
