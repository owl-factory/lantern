import { NextApiRequest, NextApiResponse } from "next";
import { setSession } from "utilities/auth";
import { getServerClient } from "utilities/db";
import { query as q } from "faunadb";
import { mapFauna } from "utilities";

const checkEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

/**
 * Handles the signin authorization endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function SignIn(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { username, password } = req.body;
  const client = getServerClient();
  const index = (checkEmail.test(username)) ? "users_by_email" : "users_by_username";
  const { instance, secret }: any = await client.query(
    q.Login(
      q.Match(q.Index(index), username),
      { password },
    )
  );

  const user: any = mapFauna(await client.query(q.Get(instance)));
  delete user.email;
  const session: any = { user, secret };
  setSession(session, { res });

  res.json(session);
}
