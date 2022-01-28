import { destroyCookie } from "@owl-factory/cookies";
import { NextApiRequest } from "next/types";
import { AuthController } from "../AuthController";

/**
 * Loads in a user from the NextAPI Request object's cookies.
 * @param req The NextAPI Request object containing the user's cookies
 */
export function fromReq(this: AuthController<unknown>, req: NextApiRequest) {
  const rawCookie = req.cookies[this.cookieKey];
  if (!rawCookie) {
    this.resetUser();
    return;
  }
  const cookie = JSON.parse(rawCookie);
  this.setUser(cookie);
}

/**
 * Resets the user and the AuthController to the default state
 */
export function resetUser(this: AuthController<unknown>) {
  destroyCookie(this.cookieKey);
  this.$user = undefined;
  this.reloadPermissions();
}
/**
 * Sets a new user
 * @param user The new user that is being logged in or authenticated
 */
export function setUser<T>(this: AuthController<T>, user: T) {
  this.resetUser();

  this.$user = user;
  this.reloadPermissions();
  console.log(this)
  this.$saveToCookie();
}
