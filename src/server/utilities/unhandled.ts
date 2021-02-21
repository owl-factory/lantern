import { NextApiResponse } from "next";

export function unhandled(res: NextApiResponse): void {
  res.status(500).json("An unknown error occured in handling the request.");
}
export default unhandled;
