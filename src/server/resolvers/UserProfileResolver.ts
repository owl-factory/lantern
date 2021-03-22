import { UserProfileModel } from "..";
import { CoreResolver } from "./CoreResolver";

/**
 * The resolver for CRUD operations on the UserProfile model.
 */
export class UserProfileResolver extends CoreResolver {
  public static model = UserProfileModel;
}
