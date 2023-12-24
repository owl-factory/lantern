import { AuthController, setGlobalAuth } from "nodes/auth";
import { User } from "@prisma/client";

// The authetication controller for Lantern
class LanternAuthController extends AuthController<User> {
  constructor() { super(); }

  get ref(): string | undefined { return this.$user?.id; }

  /**
   * Ensures that the current user is loaded into the user data
   */
  public reload() {
    super.reload();
  }
}

export const Auth = new LanternAuthController();
setGlobalAuth(Auth);

