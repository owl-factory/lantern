import { NextApiRequest, NextApiResponse } from "next"
import fetch from "cross-fetch";
import { parseCookies } from "nookies";

/**
 * Logout api endpoint that logs out of a realm session and deletes the session cookie
 * @param req server request object
 * @param res server response object
 */
export default async function Logout(req: NextApiRequest, res: NextApiResponse) {
  const token = JSON.parse(parseCookies({ req }).session).accessToken;
  const tokenRes = await fetch("https://realm.mongodb.com/api/client/v2.0/app/reroll-vsvhk/auth/revoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ token }),
  });

  res.status(200).end(await tokenRes.text());;
}
