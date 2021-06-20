import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);

  const user = await UserLogic.fetchUser(myUser, myUser);
  if (!user) { this.returnError(404, "User not found."); return; }
  const newImageAndUser = await UserLogic.updateUserImage(user, req.body, myUser);

  this.returnSuccess({ user: newImageAndUser.user, image: newImageAndUser.image });
}

export default createEndpoint({PATCH: updateProfileImage});
