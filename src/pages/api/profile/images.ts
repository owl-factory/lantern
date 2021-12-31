import { SecurityController } from "controllers/security";
import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";
import { UserLogic } from "server/logic/UserLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.findOne(SecurityController.currentUser?.ref || "");
  if (!user) { this.returnError(404, "User not found."); return; }
  const image = await ImageLogic.findOne(req.body.avatar.ref);
  if (!image) { this.returnError(404, "Image not found"); return; }
  const newUser = await UserLogic.updateAvatar(user.ref, req.body);

  this.returnSuccess({ user: newUser });
}

export default createEndpoint({PATCH: updateProfileImage});
