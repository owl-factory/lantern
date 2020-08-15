import { setCookie } from "nookies";
import { Session } from "../models/user";
import { NextApiResponse } from "next";

/**
 * A utility for creating a session and setting it as a cookie. This is called
 * by multiple authetication api endpoints
 * @param data data obtained from request body used to make the session object
 * @param res server response object used to set cookies
 */
export function createSession(data: any, res: NextApiResponse, isAnon: boolean): Session {

  const session: Session = { accessToken: data.access_token, userId: data.user_id, isAnonymous: isAnon };

  setCookie({ res }, "session", JSON.stringify(session), {
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  })

  setCookie({ res }, "refresh", data.refresh_token, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    httpOnly: true,
  })

  return session;
}