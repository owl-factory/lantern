import { NextApiRequest } from "next";
import { CoreModelLogic, UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfile(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  const userRef = CoreModelLogic.buildRef(req.query.id as string, "users");
  const user = await UserLogic.findUserByRef(userRef, userID);
  // if (!user) { this.returnError(404, "The given profile was not found."); }
  console.log(user)
  this.returnSuccess({ user });
}

export default createEndpoint({GET: getProfile});
