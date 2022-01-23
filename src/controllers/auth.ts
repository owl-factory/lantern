import { AuthController } from "@owl-factory/auth/AuthController";
import { setGlobalAuth } from "@owl-factory/auth/global";
import { UserDocument } from "types/documents";
import { permissions } from "types/security/permissions";
import { roles } from "types/security/roles";

class RerollAuthController extends AuthController<UserDocument> {
  allRoles = roles;
  allPermissions = permissions;

  protected setRole() {
    if (this.$user === undefined) {
      this.$role = "default";
      return;
    }
    this.$role = this.$user?.role || "default";
  }

  protected setPermissions() {
    if (this.$user === undefined) {
      this.$permissions = [];
      return;
    }

    this.$permissions = this.$user.permissions || [];
  }
}

export const Auth = new RerollAuthController();
setGlobalAuth(Auth);
