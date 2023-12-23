import { destroyCookie, parseCookies, setCookie } from "nookies";
import { AuthController } from "../AuthController";
import { getCtx } from "utilities/globals/next";

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Destroys all cookies used for the Auth
 */
export function destroyCookies(this: AuthController<unknown>) {
  const ctx = getCtx();

  destroyCookie(ctx, this.userCookieKey);
  destroyCookie(ctx, this.jwtCookieKey);
}

/**
 * Loads the user from the cookie, if any present
 */
export function loadFromCookie(this: AuthController<unknown>) {
  const ctx = getCtx();
  const cookies = parseCookies(ctx);
  const user = cookies[this.userCookieKey];
  const jwt = cookies[this.jwtCookieKey];

  if (user === undefined || user === "undefined") {
    this.$user = undefined;
    this.$jwt = undefined;
    return;
  }
  this.$user = JSON.parse(user);
  this.$jwt = jwt;
}

/**
 * Saves the user to the cookie, if any is present
 */
export function saveToCookie(this: AuthController<unknown>) {
  if (!this.isLoggedIn) {
    this.$destroyCookies();
  }

  const ctx = getCtx();
  setCookie(ctx, this.userCookieKey, JSON.stringify(this.$user), { maxAge: DEFAULT_MAX_AGE, path: "/" });
  setCookie(ctx, this.jwtCookieKey, this.$jwt || "", { maxAge: DEFAULT_MAX_AGE, path: "/" });
}
