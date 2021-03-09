import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver } from "../../../server";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

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

export default createEndpoint({GET: fetchContentType, PATCH: updateContentType, DELETE: deleteContentType});
