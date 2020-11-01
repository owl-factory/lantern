import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
  ],
  database: process.env.USER_DB_CONNECTION_STRING!
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
