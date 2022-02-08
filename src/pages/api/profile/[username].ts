import "reflect-metadata";
import { NextApiRequest } from "next";
import { UserLogic } from "server/logic/UserLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { UserDocument } from "types/documents";
import { getUniques } from "@owl-factory/utilities/arrays";

/**
 * Gets all of the information needed to render a user's profile page
 */
export async function getProfile(req: NextApiRequest) {
  const userSearch = await UserLogic.searchByUsername(req.query.username as string) as UserDocument[];
  if (userSearch.length === 0) { throw { code: 404, message: "The given profile was not found."}; }

  const user = await UserLogic.findOne(userSearch[0].ref);

  // TODO - store the player username and ref instead of pulling the full user
  if (user.recentPlayers) {
    user.recentPlayers = await UserLogic.findManyByIDs(getUniques(user.recentPlayers, "id"));
  }

  return { user };
}

/**
 * Gets a single profile for the profile page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfileRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getProfile(req));
}

/**
 * Updates a single profile for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfile(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.updateOne(req.body.ref, req.body);
  this.returnSuccess({ user });
}

export default createEndpoint({GET: getProfileRequest, PATCH: updateProfile});
