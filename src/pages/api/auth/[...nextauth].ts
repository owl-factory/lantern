import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";
import { User, UserSchema } from "../../../types/nextauth"

if (!process.env.GOOGLE_ID) { throw Error("GOOGLE_ID required for authentication");}
if (!process.env.GOOGLE_SECRET) { throw Error("GOOGLE_SECRET required for authentication");}
if (!process.env.USER_DB_CONNECTION_STRING) {
  throw Error("USER_DB_CONNECTION_STRING missing from envionrment variables. Authentication is disabled.");
}

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: Adapters.TypeORM.Adapter(process.env.USER_DB_CONNECTION_STRING as any,
    {
      models: {
        User: {
          model: User,
          schema: UserSchema as any
        },
    }
  }),
  callbacks: {
    async session(session: any, user: any) {
      session.user._id = user.id;
      session.user.roles = user.roles;
      console.log(session.user);
      return session;
    }
  }
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  return NextAuth(req, res, options) as Promise<void>;
};
