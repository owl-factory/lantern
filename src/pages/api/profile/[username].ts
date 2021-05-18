import { NextApiRequest } from "next";
import { CoreModelLogic, UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { UserDocument } from "types/documents";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfile(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  const user = await UserLogic.findUserByUsername(req.query.username as string, userID) as UserDocument;
  if (!user) { this.returnError(404, "The given profile was not found."); }
  if (user.recentPlayers) {
    user.recentPlayers = await UserLogic.findUsersByRefs(user.recentPlayers, userID);
  }

  this.returnSuccess({ user });
}

async function updateProfile(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  req.body.ref = CoreModelLogic.buildRef(req.body.id, "users");
  const user = await UserLogic.updateUser(req.body, userID);
  this.returnSuccess({ user });
}

export default createEndpoint({GET: getProfile, PATCH: updateProfile});
