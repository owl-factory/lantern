import { destroyCookie, getCookie, setCookie } from "@owl-factory/cookies";
import { action, makeObservable, observable } from "mobx";

export class AuthController<T> {
  public $user: T | undefined;

  protected cookieKey = "user_session";

  constructor() {
    this.reload();
    makeObservable(this, {
      $user: observable,
      resetUser: action,
      setUser: action,
    });
  }

  /**
   * Loads and reloads everything
   */
  public reload() {
    this.loadFromCookie();
  }

  /**
   * Returns the currently logged in user. May be undefined if no user is logged in
   */
  public getUser(): T | undefined { return this.$user; }
  /**
   * Resets the user and the AuthController to the default state
   */
  public resetUser() {
    destroyCookie(this.cookieKey);
    this.$user = undefined;
  }
  /**
   * Sets a new user
   * @param user The new user that is being logged in or authenticated
   */
  public setUser(user: T) {
    this.resetUser();
    this.$user = user;
  }

  get isLoggedIn() {
    return this.$user !== undefined;
  }

  /**
   * Loads the user from the cookie, if any present
   */
  protected loadFromCookie() {
    const session = getCookie(this.cookieKey);
    if (session === undefined) { return; }
    this.$user = session;
  }

  /**
   * Saves the user to the cookie, if any is present
   */
  protected saveToCookie() {
    if (this.$user === undefined) { return; }
    setCookie(this.cookieKey, this.$user);
  }
}
