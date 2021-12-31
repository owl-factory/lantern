import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";
import { UserLogic } from "server/logic/UserLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { UserDocument } from "types/documents";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.findOne(req.query.id as string);
  if (!user) { this.returnError(404, "User not found."); return; }
  const image = await ImageLogic.create(req.body.method, req.body.image);
  const userPatch: Partial<UserDocument> = { avatar:
    { ref: image.ref, src: image.src },
  };
  const updatedUser = await UserLogic.updateAvatar(user.ref, userPatch);
  this.returnSuccess({ user: updatedUser, image: image });
}

export default createEndpoint({PATCH: updateProfileImage});
