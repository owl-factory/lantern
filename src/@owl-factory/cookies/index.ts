import { getCtx } from "@owl-factory/next";
import {
  destroyCookie as destroyNookieCookie,
  parseCookies as parseNookieCookies,
  setCookie as setNookieCookie,
} from "nookies";

const defaultAge = 30 * 24 * 60 * 60;
const defaultPath = "/";

/**
 * Destroys a single cookie
 * @param key The key of the cookie to delete
 * @param path The URL path the cookie is stored in
 */
export function destroyCookie(key: string, path = defaultPath) {
  const ctx = getCtx();
  destroyNookieCookie(ctx, key, { path });
}

/**
 * Gets an item from the cookies.
 * @param key The key in the cookie to fetch
 */
export function getCookie(key: string) {
  const ctx = getCtx();
  const allCookies = parseNookieCookies(ctx);

  if (!(key in allCookies)) { return undefined; }
  const cookie = allCookies[key];
  return cookie;
}

/**
 * Sets a cookie
 * @param key The key to store data under in the cookies
 * @param content The content to store to the cookies
 * @param maxAge The maximum age of the cookie
 * @param path The path.
 */
export function setCookie(key: string, content: any, maxAge = defaultAge, path = defaultPath) {
  const ctx = getCtx();
  if (typeof content === "object") { content = JSON.stringify(content); }
  setNookieCookie(ctx, key, content, { maxAge, path });
}

