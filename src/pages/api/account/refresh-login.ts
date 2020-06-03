import { NextApiRequest, NextApiResponse } from "next"
import { setCookie } from "nookies";
import fetch from "cross-fetch";

export default async function RefreshLogin(req: NextApiRequest, res: NextApiResponse) {

  const { refresh } = await req.body;

  const tokenRes = await fetch("https://stitch.mongodb.com/api/client/v2.0/app/reroll-vsvhk/auth/providers/local-userpass/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + refresh
     },
    }
  );

  const data = await tokenRes.text();

  setCookie({res}, "authToken", data, {
    maxAge: 60 * 30,
    path: '/',
  })

  res.status(200).json(data);
}
