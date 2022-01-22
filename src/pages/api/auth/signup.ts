import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { fromFauna } from "@owl-factory/database/conversion/fauna/from";
import { getServerClient } from "@owl-factory/database/client/fauna";
import { normalize } from "@owl-factory/utilities/strings";
import { setSession } from "@owl-factory/auth/session";

/**
 * Handles the signup authorization endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function SignUp(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    res.end("Account creation is disabled at this time.");
    return;
  }

  const { email, password, username } = req.body;
  const client = getServerClient();
  // TODO - move to UserLogic
  const user: any = fromFauna(await client.query(
    q.Create(
      q.Collection("users"),
      {
        credentials: { password },
        data: {
          username: normalize(username),
          email: normalize(email),
          name: username,
          icon: "",
          roles: [],
        },
      }
    )
  ));

  const { secret }: any = await client.query(q.Login(user.ref, { password }));
  delete user.email;
  const session: any = { user, secret };
  setSession(session, { res });

  res.json(session);
}
