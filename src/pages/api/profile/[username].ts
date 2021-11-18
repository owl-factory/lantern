import { NextApiRequest } from "next";
import { getMyUser } from "server/auth";
import { UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { UserDocument } from "types/documents";
import { getUniques } from "utilities/arrays";

/**
 * Gets a single profile for the profile page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfile(this: HTTPHandler, req: NextApiRequest) {
  const userSearch = await UserLogic.searchByUsername(req.query.username as string) as UserDocument[];
  if (userSearch.length === 0) { this.returnError(404, "The given profile was not found."); }

  const user = await UserLogic.findByID(userSearch[0].id, "temp!");

  if (user.recentPlayers) {
    user.recentPlayers = await UserLogic.findManyByIDs(getUniques(user.recentPlayers, "id"));
  }

  this.returnSuccess({ user });
}

/**
 * Updates a single profile for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfile(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.updateOne(req.body.id, req.body);
  this.returnSuccess({ user });
}

export default createEndpoint({GET: getProfile, PATCH: updateProfile});
