import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver } from "../../../server";
import HTTPHandler from "../../../server/response/Response";

/**
 * Creates a new content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createContentType(this: HTTPHandler, req: NextApiRequest) {
  const contentType = await ContentTypeResolver.createOne({...req.body, rulesetID: req.query.id});
  this.returnSuccess({ contentType });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.PUT = createContentType;
  await handler.handle();
}
