import { AuthController, setGlobalAuth } from "@owl-factory/auth";
import { User } from "@prisma/client";

// The authetication controller for reroll
class RerollAuthController extends AuthController<User> {
  constructor() { super(); }

  get ref(): string | undefined { return this.$user?.id; }

  /**
   * Ensures that the current user is loaded into the user data
   */
  public reload() {
    super.reload();
  }
}

export const Auth = new RerollAuthController();
setGlobalAuth(Auth);

