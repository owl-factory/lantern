import { AuthController, setGlobalAuth, setGlobalPermissions, setGlobalRoles } from "@owl-factory/auth";
import { UserDocument } from "types/documents";

// The authetication controller for reroll
class RerollAuthController extends AuthController<UserDocument> {
  constructor() { super(); }

  get ref(): string | undefined { return this.$user?.ref; }

  /**
   * Ensures that the current user is loaded into the user data
   */
  public reload() {
    super.reload();
  }
}

export const Auth = new RerollAuthController();
setGlobalAuth(Auth);

