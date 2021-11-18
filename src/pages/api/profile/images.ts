import { SecurityController } from "controllers/security";
import { NextApiRequest } from "next";
import { ImageLogic, UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.findByID(SecurityController.currentUser?.id || "");
  if (!user) { this.returnError(404, "User not found."); return; }
  const image = await ImageLogic.findByID(req.body.avatar.id);
  if (!image) { this.returnError(404, "Image not found"); return; }
  const newUser = await UserLogic.updateAvatar(user.id, req.body);

  this.returnSuccess({ user: newUser });
}

export default createEndpoint({PATCH: updateProfileImage});
