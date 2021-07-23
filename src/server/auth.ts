import { NextApiRequest } from "next";
import { getSession } from "utilities/auth";
import { toFaunaRef } from "utilities/fauna";
import { MyUserDocument } from "./logic/CoreModelLogic";

export function getMyUser(req: NextApiRequest): MyUserDocument {
  // TODO - have this working on page refresh
 const myUser = getSession({req});
 if (myUser === null || !("user" in myUser)) {
  const myUser2: MyUserDocument = {
    id: "295863299256353286",
    collection: "users",
    ref: toFaunaRef({
      id: "295863299256353286",
      collection: "users",
    }),
    roles: [],
    isLoggedIn: true,
};
  myUser2.ref = toFaunaRef(myUser2);
  return myUser2;
  //  return {} as MyUserDocument;
 }

  myUser.user.ref = toFaunaRef({ id: myUser.user.id, collection: "users" });
  return myUser.user;
}


export function requireLogin(myUser: MyUserDocument): void {
  if(!myUser) { throw { code: 403, message: "You must be logged in to perform this action." }; }
}
