import { NextApiRequest } from "next";
import { getSession } from "utilities/auth";
import { toFaunaRef } from "utilities/fauna";
import { MyUserDocument } from "./logic/CoreModelLogic";

export function getMyUser(req: NextApiRequest): MyUserDocument {
  // TODO - have this working on page refresh
  const myUser2 = getSession({req});
  if (myUser2 !== null) { return myUser2; }

  const myUser: MyUserDocument = {
    id: "295863299256353286",
    collection: "users",
    ref: toFaunaRef({
      id: "295863299256353286",
      collection: "users",
    }),
    roles: [],
    isLoggedIn: true,
};
  myUser.ref = toFaunaRef(myUser);
  return myUser;
}

export function requireLogin(myUser: MyUserDocument): void {
  if(!myUser.isLoggedIn) { throw { code: 403, message: "You must be logged in to perform this action." }; }
}
