import { NextApiRequest } from "next/types";
import { AuthController } from "../AuthController";

/**
 * Loads a user from an API response (sign up or sign in)
 * @param user The user object, containing a name and a small amount of extra information
 * @param permissions The permissions of a user, passed in as a base64 string
 * @param jwt A JSON web token containing a compressed version of the user information and the permissions
 */
 export function fromAPI<T>(this: AuthController<T>, user: T, jwt: string | undefined) {
  this.$user = user;
  this.$jwt = jwt;

  this.$saveToCookie();
}

/**
 * Loads in a user from the NextAPI Request object's cookies.
 * @param req The NextAPI Request object containing the user's cookies
 */
export function fromReq(this: AuthController<unknown>, req: NextApiRequest) {
  const user = req.cookies[this.userCookieKey];
  const jwt = req.cookies[this.jwtCookieKey]; // TODO - use auth header in the future

  if (user === undefined) {
    this.reset();
    return;
  }

  this.fromAPI(JSON.parse(user), jwt);
}

/**
 * Resets the user and the AuthController to the default state
 */
export function resetUser(this: AuthController<unknown>) {
  this.$user = undefined;
  this.$jwt = undefined;
  this.$destroyCookies();
}


