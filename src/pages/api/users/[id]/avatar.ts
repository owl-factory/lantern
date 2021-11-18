import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { ImageLogic, UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { UserDocument } from "types/documents";

/**
 * Updates a single profile image for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfileImage(this: HTTPHandler, req: NextApiRequest) {

  const user = await UserLogic.findByID(req.query.id as string);
  if (!user) { this.returnError(404, "User not found."); return; }
  const image = await ImageLogic.create(req.body.method, req.body.image);
  const userPatch: Partial<UserDocument> = { avatar:
    { id: image.id, collection: image.collection, ref: image.ref, src: image.src },
  };
  const updatedUser = await UserLogic.updateAvatar(user.id, userPatch);
  this.returnSuccess({ user: updatedUser, image: image });
}

export default createEndpoint({PATCH: updateProfileImage});
