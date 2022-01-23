
export class AuthController<T> {
  public $user: T | undefined;


  /**
   * Returns the currently logged in user. May be undefined if no user is logged in
   */
  public getUser(): T | undefined { return this.$user; }
  /**
   * Resets the user and the AuthController to the default state
   */
  public resetUser() {
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
}
