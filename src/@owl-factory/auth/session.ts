import fetch from "cross-fetch";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { query as q } from "faunadb";
import { getClient, updateClient } from "@owl-factory/database/client/fauna";

// TODO - COMMENT AND REFACTOR

/**
 * Sends a request to sign a user up to the API
 * @param username The username of the user attempting to sign up
 * @param email The email of the user attempting to sign up
 * @param password The password of the user attempting to sign up
 */
export function signUp(username: string, email: string, password: string): void {
  fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, email, password}),
  }).then(async (res) => {
    const session: any = await res.json();
    updateClient(session.secret);
    Router.reload();
  });
}

/**
 * Attempts to log in a user
 * @param username The username of the user to log in
 * @param password The password of the user to log in
 */
export function signIn(username: string, password: string): void {
  fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password}),
  }).then(async (res) => {
    const session: any = await res.json();
    updateClient(session.secret);
    Router.reload();
  });
}

/**
 * Logs a user out
 */
export function signOut(): void {
  getClient().query(q.Logout(false)).then((res: unknown) => {
    if (res) {
      destroySession();
      Router.reload();
    } else {
      throw Error("Something went wrong logging out!");
    }
  });
}

export type CtxRes = Pick<NextPageContext, "res"> | {res: NextApiResponse<any>;} | null | undefined;
export type CtxReq = Pick<NextPageContext, "req"> | {req: NextApiRequest;} | null | undefined;

/**
 * Sets a session in the cookies
 * @param session The session to set
 * @param ctx The Next Page Context 
 */
export function setSession(session: any, ctx?: CtxRes): void {
  setCookie(ctx, "session", JSON.stringify(session), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
}

/**
 * Destroys the session
 * @param ctx The next page context
 */
export function destroySession(ctx?: CtxRes): void {
  destroyCookie(ctx, "session", { path: '/' });
}

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
 * Authenticates the user
 * TODO - rework this? We don't access Fauna or auth through the UI
 * @param ctx The Next Page context
 */
export async function authenticate(ctx?: CtxReq): Promise<any | null> {
  const session = getSession(ctx);
  const client = getClient(ctx);
  const id: any = await client.query(q.CurrentIdentity());
  if (id.id === session?.user.ref["@ref"]?.id) {
    return session;
  } else {
    return null;
  }
}

/**
 * A session hook
 */
export function useSession(): any | undefined | null {
  const [ ses, setSes ] = useState<any | undefined | null>();
  useEffect(() => {
    setSes(getSession());
  }, []);
  return ses;
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
