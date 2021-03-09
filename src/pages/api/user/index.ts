import { NextApiRequest } from "next";
import { RulesetResolver } from "../../../server/resolvers/RulesetResolver";
import HTTPHandler from "../../../server/response/Response";
import { authenticateUser, authorizeUserRole, getUser } from "../../../server/utilities/auth";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Test endpoint
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getSelf(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  this.returnSuccess({"user": user});
}

export default createEndpoint({GET: getSelf});
