import { NextApiRequest, NextApiResponse } from "next";

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
}
