import { NextApiRequest } from "next";
import { authenticate } from "utilities/auth";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Test endpoint
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getSelf(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  this.returnSuccess({"user": session?.user});
}

export default createEndpoint({GET: getSelf});
