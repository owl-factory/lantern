import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { ContentLogic } from "server/logic/ContentLogic";

/**
 * Fetches the given contents
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentList(this: HTTPHandler, req: NextApiRequest) {
  const contents = await ContentLogic.searchAllContents();
  this.returnSuccess({ docs: contents });
}

export default createEndpoint({POST: getContentList});
