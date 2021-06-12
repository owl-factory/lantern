import { NextApiRequest } from "next";
import { UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { toFaunaRef } from "utilities/fauna";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  if (!userID) { this.returnError(403, "You must be logged in to perform this action."); return; }
  const user = await UserLogic.findUserByRef(toFaunaRef(userID, "users"), userID);
  if (!user) { this.returnError(404, "User not found."); return; }
  const updatedUser = await UserLogic.updateUserImage(user, req.body, userID);

  this.returnSuccess({ user: updatedUser });
}

export default createEndpoint({PATCH: updateProfileImage});
