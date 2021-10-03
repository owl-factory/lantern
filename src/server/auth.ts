import { Expr } from "faunadb";
import { NextApiRequest } from "next";
import { MyUserDocument, UserRole, UserRoleReadable } from "types/security";
import { getSession } from "utilities/auth";
import { toFaunaRef } from "utilities/fauna";

export function getMyUser(req: NextApiRequest): MyUserDocument {
  // TODO - have this working on page refresh
  const myUser = getSession({req});
  // If someone is not logged in
  if (myUser === null || !("user" in myUser)) {
    // TODO - until auth issues are resolved, we're going to fake an active user
    const myUser2: MyUserDocument = {
      id: "295863299256353286",
      collection: "users",
      ref: toFaunaRef({
        id: "295863299256353286",
        collection: "users",
      }) as Expr,
      roles: [],
      role: UserRole.USER,
      isLoggedIn: true,
    };
    myUser2.ref = toFaunaRef(myUser2) as Expr;
    myUser2.role = getHighestRole(myUser2);
    return myUser2;
    //  return {} as MyUserDocument;
  }
  myUser.user.ref = toFaunaRef({ id: myUser.user.id, collection: "users" });
  if (myUser.user.id) {
    myUser.user.isLoggedIn = true;
    myUser.user.role = UserRole.USER;
  }

  if (myUser.user.roles.includes("admin")) {
    myUser.user.role = UserRole.ADMIN;
  }

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
    UserRoleReadable.forEach((readableRole: string, index: number) => {
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
