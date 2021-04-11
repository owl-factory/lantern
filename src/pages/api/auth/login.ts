import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient, q } from "utilities/db";

const checkEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

/**
 * Handles the login authorization endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function Login(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { identifier, password } = req.body;
  const client = getServerClient();
  const index = (checkEmail.test(identifier)) ? "users_by_email" : "users_by_username";
  const response = client.query(
    q.Login(
      q.Match(q.Index(index), identifier),
      { password },
    )
  );
  res.json(response);
}
