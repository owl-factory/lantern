import { NextApiRequest } from "next";
import { ContentTypeLogic } from "server/logic/ContentTypeLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentTypes(this: HTTPHandler, req: NextApiRequest) {
  const contentTypes = await ContentTypeLogic.findManyByIDs(req.body.ids);
  this.returnSuccess({ docs: contentTypes });
}

export default createEndpoint({POST: getContentTypes});
