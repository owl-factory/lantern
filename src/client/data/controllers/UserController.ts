import { ImageDocument, UserDocument } from "types/documents";
import { rest } from "utilities/request";
import { ImageManager, UserManager } from "../managers";
import { DataController } from "./DataController";


interface UpdateProfileImageResponse {
  user: UserDocument,
  image: ImageDocument
}
class $UserController extends DataController<UserDocument> {
  /**
   * Updates a user's profile image using the given image document and upload method.
   * @param id The user ID to update
   * @param image The image, new or existing, to set as the new profile image
   * @param method The method of creating or grabbing the image
   */
  public async updateAvatar(id: string, image: ImageDocument, method: string):
    Promise<{user: UserDocument, image: ImageDocument} | undefined> {
    const updateProfileImageURI = `/api/users/${id}/avatar`;
    if (!this.isUserLoggedIn()) {
      // TODO - push to alert controller
      return;
    }
    const result = await rest.patch<UpdateProfileImageResponse>(updateProfileImageURI, { image, method });
    if (!result.success) {
      // TODO - push error to alert controller
      return;
    }

    UserManager.set(result.data.user);
    console.log(UserManager.get(result.data.user.id)?.avatar.src)
    ImageManager.set(result.data.image);
    return { user: result.data.user, image: result.data.image };
  }
}

export const UserController = new $UserController(UserManager, "/api/users");


