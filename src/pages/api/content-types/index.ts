import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver } from "../../../server";
import HTTPHandler from "../../../server/response/Response";
import { FieldTypeEnum } from "../../../types";

/**
 * Creates a new content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createContentType(this: HTTPHandler, req: NextApiRequest) {
  const body = req.body;
  body.fields = { name: { name: "Name", key: "name", type: FieldTypeEnum.Text }};
  const contentType = await ContentTypeResolver.createOne(body, this.ctx);
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
