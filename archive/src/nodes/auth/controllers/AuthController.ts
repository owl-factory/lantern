import { action, makeObservable, observable } from "mobx";

import * as cookies from "./functionality/cookies";
import * as security from "./functionality/security";
import * as user from "./functionality/user";

export class AuthController<T> {
  public $user: T | undefined;
  public $jwt: string | undefined;

  protected userCookieKey = "session";
  protected jwtCookieKey = "session_jwt";

  constructor() {
    this.reload();
    makeObservable(this, {
      $user: observable,
      $jwt: observable,
      reset: action,
      fromAPI: action,
      fromReq: action,
    });
  }

  /**
   * Returns the currently logged in user. May be undefined if no user is logged in
   */
  get user(): T | undefined { return this.$user; }
  get isLoggedIn() { return this.$user !== undefined; }
  get jwt() { return this.$jwt; }

  public $extractSecurity(fullUser: T) {
    return { user: fullUser, role: "default", permissions: [] };
  }

  /**
   * Loads and reloads everything
   */
  public reload() {
    this.$loadFromCookie();
  }

  // COOKIES
  public $destroyCookies = cookies.destroyCookies;
  public $loadFromCookie = cookies.loadFromCookie;
  public $saveToCookie = cookies.saveToCookie;

  // SECURITY
  public hasPermission = security.hasPermission;

  public fromAPI = user.fromAPI;
  public fromReq = user.fromReq;
  public reset = user.resetUser;
}
