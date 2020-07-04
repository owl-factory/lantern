import { NextApiRequest, NextApiResponse } from "next"
import fetch from "cross-fetch";
import { createSession } from "../../../helpers/api";
import { parseCookies } from "nookies";

export default async function RefreshLogin(req: NextApiRequest, res: NextApiResponse) {
  const tokenRes = await fetch("https://realm.mongodb.com/api/client/v2.0/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + parseCookies().refresh
     },
    }
  );

  const json = await tokenRes.json();
  const session = createSession(json, res);

  res.status(200).json(session);
}
