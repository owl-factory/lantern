import "reflect-metadata";
import { NextApiRequest } from "next";
import { FileLogic } from "server/logic/FileLogic";
import { UserLogic } from "server/logic/UserLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { Auth } from "controllers/auth";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.fetch(Auth.user?.ref || "");
  if (!user) { this.returnError(404, "User not found."); return; }
  const image = await FileLogic.fetch(req.body.avatar.ref);
  if (!image) { this.returnError(404, "Image not found"); return; }
  const newUser = await UserLogic.updateAvatar(user.ref, req.body);

  this.returnSuccess({ user: newUser });
}

export default createEndpoint({PATCH: updateProfileImage});
