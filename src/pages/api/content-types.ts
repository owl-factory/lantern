import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { ContentTypeLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentTypes(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  const contentTypes = await ContentTypeLogic.fetchMany(req.body.ids, myUser);
  this.returnSuccess({ contentTypes: contentTypes });
}

export default createEndpoint({POST: getContentTypes});