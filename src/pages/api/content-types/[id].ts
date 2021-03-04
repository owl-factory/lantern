import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver } from "../../../server";
import HTTPHandler from "../../../server/response/Response";

/**
 * Fetches a single content type
 * @param this The handler class calling this function
 * @param req The request to update in the server
 */
async function fetchContentType(this: HTTPHandler, req: NextApiRequest) {
  const contentType = await ContentTypeResolver.findOne(req.query.id as string);
  console.log(contentType)
  this.returnSuccess({ contentType });
}

/**
 * Updates a single content type
 * @param this The handler class calling this function
 * @param req The request to update in the server
 */
async function updateContentType(this: HTTPHandler, req: NextApiRequest) {
  const result = await ContentTypeResolver.updateOne(
    req.query.id as string,
    req.body
  );
  this.returnSuccess(result);
}

/**
 * Deletes a single content type
 * @param this The handler class calling this function
 * @param req The request to delete in the server
 */
async function deleteContentType(this: HTTPHandler, req: NextApiRequest) {
  const result = await ContentTypeResolver.deleteOne(req.query.contentTypeID as string);
  this.returnSuccess(result);
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = fetchContentType;
  handler.PATCH = updateContentType;
  handler.DELETE = deleteContentType;
  await handler.handle();
}
