import { NextApiRequest, NextApiResponse } from "next";
import { Session, User } from "types";
import { setSession } from "utilities/auth";
import { getServerClient, q } from "utilities/db";

/**
 * Handles the signup authorization endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function SignUp(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { email, password, username } = req.body;
  const client = getServerClient();
  const user: User = await client.query(
    q.Create(
      q.Collection("users"),
      {
        credentials: { password },
        data: {
          email,
          username,
          displayName: "",
          icon: "",
        },
      }
    )
  );

  const { secret }: any = await client.query(q.Login(user.ref, { password }));
  delete user.data.email;
  const session: Session = { user, secret };
  setSession(session, { res });

  res.json(session);
}
