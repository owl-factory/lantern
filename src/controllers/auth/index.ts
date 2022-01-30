import { AuthController } from "@owl-factory/auth/AuthController";
import { setGlobalAuth, setGlobalPermissions, setGlobalRoles } from "@owl-factory/auth/globals";
import { UserDocument } from "types/documents";
import { permissions } from "types/security/permissions";
import { roles } from "types/security/roles";


class RerollAuthController extends AuthController<UserDocument> {
  constructor() {
    super();
    this.reloadPermissions();

  }

  /**
   * A Reroll-specific function to grab the user's role
   */
  public $setRole() {
    if (this.$user === undefined) {
      this.$role = "default";
      return;
    }
    this.$role = this.$user?.role || "default";
  }

  /**
   * A Reroll-specific function to grab the user's permissions
   */
  public $setPermissions() {
    if (this.$user === undefined) {
      this.$permissions = [];
      return;
    }

    this.$permissions = this.$user.permissions || [];
  }
}


setGlobalRoles(roles);
setGlobalPermissions(permissions);

export const Auth = new RerollAuthController();
setGlobalAuth(Auth);

