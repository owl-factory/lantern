import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { ContentLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyContent(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const contents = await ContentLogic.fetchMyContent([], { size: 20 }, myUser);
  this.returnSuccess({ contents: contents });
}

export default createEndpoint({GET: getMyContent});