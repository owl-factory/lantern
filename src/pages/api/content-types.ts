import "reflect-metadata";
import { NextApiRequest } from "next";
import { ContentTypeLogic } from "server/logic/ContentTypeLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentTypes(this: HTTPHandler, req: NextApiRequest) {
  const contentTypes = await ContentTypeLogic.findManyByIDs(req.body.refs);
  this.returnSuccess({ contentTypes });
}

export default createEndpoint({POST: getContentTypes});
