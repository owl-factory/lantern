import { CtxReq } from "@owl-factory/next/types";
import { NextPageContext } from "next";
import Router from "next/router";
import { parseCookies } from "nookies";

// TODO - COMMENT AND REFACTOR

/**
 * Fetches the current session, if any
 * @param ctx The Next page context
 * @returns The current session
 */
export function getSession(ctx?: CtxReq): any | null {
  const cookie = parseCookies(ctx).session;
  if (!cookie)
    return null;
  const session: any = JSON.parse(cookie);
  return session;
}

/**
 * Returns true if the user is logged in, false otherwise, or sends the user to the home page
 * @param session The current session, if any
 * @param ctx The Next Page Context
 */
export function requireClientLogin(session: any | null, ctx?: NextPageContext) {
  if (!session) {
    if (ctx && ctx.res) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    } else {
      Router.push("/");
    }
    return false;
  }
  return true;
}
