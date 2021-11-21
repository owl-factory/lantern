import { NextApiRequest } from "next";
import { ContentLogic } from "server/logic/ContentLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContents(this: HTTPHandler, req: NextApiRequest) {
  const contents = await ContentLogic.findManyByIDs(req.body.refs);
  this.returnSuccess({ docs: contents });
}

export default createEndpoint({POST: getContents});
