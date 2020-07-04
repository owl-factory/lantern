import { setCookie } from "nookies";
import { Session } from "../models/user";
import { NextApiResponse } from "next";

export function createSession(data: any, res: NextApiResponse): Session {

  const session: Session = { accessToken: data.access_token, userId: data.user_id };

  setCookie({res}, "session", JSON.stringify(session), {
    maxAge: 60 * 60  * 24 * 30,
    path: '/'
  })

  setCookie({res}, "refresh", data.refresh, {
    maxAge: 60 * 60  * 24 * 30,
    path: '/',
    secure: true,
    httpOnly: true,
  })

  return session;
}