import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getDashboardPage(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  const images = await ImageLogic.fetchMyImages(userID);
  this.returnSuccess({ images });
}

export default createEndpoint({GET: getDashboardPage});
