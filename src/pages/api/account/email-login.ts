import { NextApiRequest, NextApiResponse } from "next"
import { setCookie } from "nookies";
import fetch from "cross-fetch";

export default async function EmailLogin(req: NextApiRequest, res: NextApiResponse) {

  const { email, password } = await req.body;

  const tokenRes = await fetch("https://stitch.mongodb.com/api/client/v2.0/app/reroll-vsvhk/auth/providers/local-userpass/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: req.body.username,
        password: req.body.password
      })
    }
  );

  const data = await tokenRes.text();

  setCookie({res}, "authToken", data, {
    maxAge: 60 * 30,
    path: '/',
  })

  res.status(200).end();
}
