import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { ContentLogic } from "server/logic/ContentLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContents(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const contents = await ContentLogic.findManyByIDs(req.body.ids);
  this.returnSuccess({ docs: contents });
}

export default createEndpoint({POST: getContents});
