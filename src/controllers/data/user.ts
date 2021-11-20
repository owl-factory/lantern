import { AlertController } from "controllers/AlertController";
import { ImageDocument, UserDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/assetSource";
import { rest } from "utilities/request";
import { DataController } from "controllers/data/DataController";
import { ImageManager } from "controllers/data/image";
import { DataManager } from "controllers/data/DataManager";


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
  public async updateAvatar(id: string, image: Partial<ImageDocument>, method: AssetUploadSource):
    Promise<{user: UserDocument, image: ImageDocument} | undefined> {
    const updateProfileImageURI = `/api/users/${id}/avatar`;
    if (!this.isUserLoggedIn()) {
      AlertController.error(`You must be logged in to update a user avatar.`);
      return;
    }
    const result = await rest.patch<UpdateProfileImageResponse>(updateProfileImageURI, { image, method });
    if (!result.success) {
      AlertController.error(`An error occured while setting an avatar: ${result.message}`);
      return;
    }
    console.log(result.data.user)
    UserManager.set(result.data.user);
    ImageManager.set(result.data.image);
    AlertController.success(
      `The avatar for ${result.data.user.name || result.data.user.username} has been updated.`
    );
    return { user: result.data.user, image: result.data.image };
  }
}

export const UserManager = new DataManager<UserDocument>("user");
export const UserController = new $UserController(UserManager, "/api/users");


