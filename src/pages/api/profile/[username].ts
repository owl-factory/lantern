import { toFaunaRef } from "database/conversion/fauna/to";
import { NextApiRequest } from "next";
import { getMyUser } from "server/auth";
import { UserLogic } from "server/logic";
import { DocumentReference } from "server/logic/CoreModelLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { UserDocument } from "types/documents";

/**
 * Gets a single profile for the profile page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfile(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);

  const userSearch = await UserLogic.findByUsername(req.query.username as string, {}, myUser) as UserDocument[];
  if (userSearch.length === 0) { this.returnError(404, "The given profile was not found."); }

  const user = await UserLogic.fetch(userSearch[0].id, myUser);

  if (user.recentPlayers) {
    user.recentPlayers = await UserLogic.fetchMany(user.recentPlayers as DocumentReference[], myUser);
  }

  this.returnSuccess({ user });
}

/**
 * Updates a single profile for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfile(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);

  req.body.ref = toFaunaRef({ id: req.body.id, collection: "users" });
  const user = await UserLogic.update(req.body.id, req.body, myUser);
  this.returnSuccess({ user });
}

export default createEndpoint({GET: getProfile, PATCH: updateProfile});
