import { destroyCookie, getCookie, setCookie } from "@owl-factory/cookies";
import { binaryToBase64 } from "@owl-factory/utilities/numbers/base2";
import { AuthController } from "../AuthController";

export function destroyCookies(this: AuthController<unknown>) {
  destroyCookie(this.userCookieKey);
  destroyCookie(this.permissionCookieKey);
  destroyCookie(this.jwtCookieKey);
}

/**
 * Loads the user from the cookie, if any present
 */
export function loadFromCookie(this: AuthController<unknown>) {
  const user = getCookie(this.userCookieKey);
  const permissions = getCookie(this.permissionCookieKey);
  const jwt = getCookie(this.jwtCookieKey);

  if (user === undefined) {
    this.$user = undefined;
    this.$permissions = undefined;
    this.$jwt = undefined;
    return;
  }

  this.$user = user;
  this.$permissions = permissions;
  this.$jwt = jwt;
}

/**
 * Saves the user to the cookie, if any is present
 */
export function saveToCookie(this: AuthController<unknown>) {
  if (!this.isLoggedIn) {
    this.$destroyCookies();
  }

  setCookie(this.userCookieKey, this.$user);
  if (this.$permissions) { setCookie(this.permissionCookieKey, binaryToBase64(this.$permissions)); }
  if (this.$jwt) { setCookie(this.jwtCookieKey, this.$jwt); }
}
