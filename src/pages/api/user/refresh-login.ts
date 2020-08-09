import { NextApiRequest, NextApiResponse } from "next"
import fetch from "cross-fetch";
import { parseCookies } from "nookies";
import { Session } from "../../../models/user";

/**
 * Api endpoint that refreshes a session token with the realm api and
 * updates the session cookie
 * @param req server request object
 * @param res server response object
 */
export default async function RefreshLogin(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies({ req });
  const tokenRes = await fetch("https://realm.mongodb.com/api/client/v2.0/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + cookies.refresh
    },
  });

  const json = await tokenRes.json();
  const session: Session = JSON.parse(cookies.session);
  session.accessToken = json.access_token;

  res.status(200).json(session);
}
