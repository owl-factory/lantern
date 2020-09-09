import { NextApiRequest, NextApiResponse } from "next"
import fetch from "cross-fetch";
import { createSession } from "../../../utilities/api";

/**
 * Api endpoint that logs into the realm api using an anonymous identity
 * and then saves the new session as a cookie
 * @param req server request object
 * @param res server response object
 */
export default async function AnonymousLogin(req: NextApiRequest, res: NextApiResponse) {
  const tokenRes = await fetch("https://realm.mongodb.com/api/client/v2.0/app/reroll-vsvhk/auth/providers/anon-user/login", { method: "POST" });

  const json = await tokenRes.json();
  const session = createSession(json, res, true);

  res.status(200).json(session);
}
