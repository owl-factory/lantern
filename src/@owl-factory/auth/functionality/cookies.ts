import { getCookie, setCookie } from "@owl-factory/cookies";
import { AuthController } from "../AuthController";

/**
 * Loads the user from the cookie, if any present
 */
export function loadFromCookie(this: AuthController<unknown>) {
  const session = getCookie(this.cookieKey);
  if (session === undefined) { return; }
  this.$user = session;
}

/**
 * Saves the user to the cookie, if any is present
 */
export function saveToCookie(this: AuthController<unknown>) {
  if (this.$user === undefined) { return; }
  setCookie(this.cookieKey, this.$user);
}
