import { NextApiRequest } from "next";
import { getSession } from "utilities/auth";
import { toFaunaRef } from "utilities/fauna";
import { RoleReadable, UserRole } from "./apiConfigBuilder/types";
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
    role: UserRole.USER,
    isLoggedIn: true,

  };
  myUser2.ref = toFaunaRef(myUser2);
  myUser2.role = getHighestRole(myUser2);
  return myUser2;
  //  return {} as MyUserDocument;
 }

  myUser.user.ref = toFaunaRef({ id: myUser.user.id, collection: "users" });
  return myUser.user;
}

/**
 * Determines the highest role present for a given My User document
 * @param myUser The MyUser Document to reference for determining the highest role present
 */
function getHighestRole(myUser: MyUserDocument): UserRole {
  // Base cases. If not logged in or missing roles, Guest. If logged in but no roles set, User
  if (!myUser.roles || !myUser.isLoggedIn) { return UserRole.GUEST; }
  if (myUser.roles.length === 0 && myUser.isLoggedIn) { return UserRole.USER; }

  let highest = 0;

  myUser.roles.forEach((role: string) => {
    RoleReadable.forEach((readableRole: string, index: number) => {
      if (role.toLowerCase() === readableRole && index > highest) {
        highest = index;
      }
    });
  });
  return highest as UserRole;
}


export function requireLogin(myUser: MyUserDocument): void {
  if(!myUser) { throw { code: 403, message: "You must be logged in to perform this action." }; }
}
