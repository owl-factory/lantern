import { NextApiRequest, NextApiResponse } from "next"
import fetch from "cross-fetch";
import { createSession } from "../../../helpers/api";

export default async function AnonymousLogin(req: NextApiRequest, res: NextApiResponse) {
  const tokenRes = await fetch("https://realm.mongodb.com/api/client/v2.0/app/reroll-vsvhk/auth/providers/anon-user/login", { method: "POST" });

  const json = await tokenRes.json();
  const session = createSession(json, res);

  res.status(200).json(session);
}
