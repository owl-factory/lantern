import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  session: Session | null;
}
