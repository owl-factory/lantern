import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient, q } from "utilities/db";

/**
 * Handles the login authorization endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function Signup(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { email, password, username } = req.body;
  const client = getServerClient();
  const response = await client.query(
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
  res.json(response);
}
