import { NextApiRequest } from "next";
import { ContentLogic } from "server/logic/ContentLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyContent(this: HTTPHandler, _req: NextApiRequest) {
  const contents = await ContentLogic.searchMyContent({ size: 20 });
  this.returnSuccess({ contents: contents });
}

export default createEndpoint({GET: getMyContent});
