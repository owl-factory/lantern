import fetch from "cross-fetch";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { getClient, updateClient } from "utilities/db";
import { query as q } from "faunadb";

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

export function setSession(session: any, ctx?: CtxRes): void {
  setCookie(ctx, "session", JSON.stringify(session), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
}

export function destroySession(ctx?: CtxRes): void {
  destroyCookie(ctx, "session", { path: '/' });
}

export type CtxReq = Pick<NextPageContext, "req"> | {req: NextApiRequest;} | null | undefined;

export function getSession(ctx?: CtxReq): any | null {
  const cookie = parseCookies(ctx).session;
  if (!cookie)
    return null;
  const session: any = JSON.parse(cookie);
  return session;
}

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

export function useSession(): any | undefined | null {
  const [ ses, setSes ] = useState<any | undefined | null>();
  useEffect(() => {
    setSes(getSession());
  }, []);
  return ses;
}

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
