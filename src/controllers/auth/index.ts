import { AuthController } from "@owl-factory/auth/AuthController";
import { setGlobalAuth, setGlobalPermissions, setGlobalRoles } from "@owl-factory/auth/globals";
import { UserDocument } from "types/documents";
import { permissions } from "types/security/permissions";
import { roles } from "types/security/roles";

class RerollAuthController extends AuthController<UserDocument> {
  constructor() { super(); }

  get ref(): string | undefined { return this.$user?.ref; }
}


setGlobalRoles(roles);
setGlobalPermissions(permissions);

export const Auth = new RerollAuthController();
setGlobalAuth(Auth);

