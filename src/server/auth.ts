import { NextApiRequest } from "next";
import { toFaunaRef } from "utilities/fauna";
import { MyUserDocument } from "./logic/CoreModelLogic";

export function getMyUser(req: NextApiRequest): MyUserDocument {
  const myUser: MyUserDocument = {
    id: "295863299256353286",
    collection: "users",
    ref: toFaunaRef({
      id: "295863299256353286",
      collection: "users",
    }),
    roles: [],
    isLoggedIn: true
};
  myUser.ref = toFaunaRef(myUser);
  return myUser;
}

export function requireLogin(myUser: MyUserDocument): void {
  if(!myUser.isLoggedIn) { throw { code: 403, message: "You must be logged in to perform this action." }; }
}
