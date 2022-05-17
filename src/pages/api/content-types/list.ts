import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { ContentTypeLogic } from "server/logic/ContentTypeLogic";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentTypeList(this: HTTPHandler, req: NextApiRequest) {
  const contentTypes = await ContentTypeLogic.searchAllContentTypes();
  this.returnSuccess({ docs: contentTypes });
}

export default createEndpoint({POST: getContentTypeList});
