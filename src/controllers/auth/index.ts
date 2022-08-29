import { AuthController, setGlobalAuth, setGlobalPermissions, setGlobalRoles } from "@owl-factory/auth";
import { UserData } from "controllers/data/UserData";
import { UserDocument } from "types/documents";
import { permissions } from "types/security/permissions";
import { roles } from "types/security/roles";

// The authetication controller for reroll
class RerollAuthController extends AuthController<UserDocument> {
  constructor() { super(); }

  get ref(): string | undefined { return this.$user?.ref; }

  /**
   * Ensures that the current user is loaded into the user data
   */
  public reload() {
    super.reload();
    if (!this.user) return;

    UserData.set(this.user, false);
  }
}


setGlobalRoles(roles);
setGlobalPermissions(permissions);

export const Auth = new RerollAuthController();
setGlobalAuth(Auth);

