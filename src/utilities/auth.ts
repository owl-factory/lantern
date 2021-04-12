import fetch from "cross-fetch";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { Session } from "types";
import { getClient, q, updateClient } from "./db";

export function signUp(username: string, email: string, password: string): void {
  fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, email, password}),
  }).then(async (res) => {
    const session: Session = await res.json();
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
    const session: Session = await res.json();
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

export function setSession(session: Session, ctx?: CtxRes): void {
  setCookie(ctx, "session", JSON.stringify(session), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
}

export function destroySession(ctx?: CtxRes): void {
  destroyCookie(ctx, "session", { path: '/' });
}

export type CtxReq = Pick<NextPageContext, "req"> | {req: NextApiRequest;} | null | undefined;

export function getSession(ctx?: CtxReq): Session | null {
  const cookie = parseCookies(ctx).session;
  if (!cookie)
    return null;
  const session: Session = JSON.parse(cookie);
  return session;
}

export async function authenticate(ctx?: CtxReq): Promise<Session | null> {
  const session = getSession(ctx);
  const client = getClient(ctx);
  const id: any = await client.query(q.CurrentIdentity());
  if (id.id === session?.user.ref["@ref"].id) {
    return session;
  } else {
    return null;
  }
}

export function useSession(): Session | undefined | null {
  const [ ses, setSes ] = useState<Session | undefined | null>();
  useEffect(() => {
    setSes(getSession());
  }, []);
  return ses;
}
