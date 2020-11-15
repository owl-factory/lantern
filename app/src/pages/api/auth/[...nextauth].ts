import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

if (!process.env.GOOGLE_ID) { throw Error("GOOGLE_ID required for authentication");}
if (!process.env.GOOGLE_SECRET) { throw Error("GOOGLE_SECRET required for authentication");}
if (!process.env.USER_DB_CONNECTION_STRING) { throw Error("USER_DB_CONNECTION_STRING missing from envionrment variables. Authentication is disabled.");}

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  database: process.env.USER_DB_CONNECTION_STRING
}

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, options);
