import { toFaunaRef } from "database/conversion/fauna/to";
import { Expr } from "faunadb";
import { NextApiRequest } from "next";
import { MyUserDocument, UserRole, UserRoleReadable } from "types/security";
import { getSession } from "utilities/auth";
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
      role: UserRole.User,
      roles: [UserRole.User],
      isLoggedIn: true,
    };
    myUser2.ref = toFaunaRef(myUser2) as Expr;
    myUser2.role = getHighestRole(myUser2);
    return myUser2;
    //  return {} as MyUserDocument;
  }
  myUser.user.ref = toFaunaRef({ id: myUser.user.id, collection: "users" });
  myUser.user.roles = [];
  if (myUser.user.id) {
    myUser.user.isLoggedIn = true;
    myUser.user.role = UserRole.User;
    myUser.user.roles.push(UserRole.User);
  }

  if (myUser.user.roles.includes("admin")) {
    myUser.user.role = UserRole.Admin;
    myUser.user.roles.push(UserRole.Admin);

  }

  return myUser.user;
}

/**
 * Determines the highest role present for a given My User document
 * @param myUser The MyUser Document to reference for determining the highest role present
 */
function getHighestRole(myUser: MyUserDocument): UserRole {
  // Base cases. If not logged in or missing roles, Guest. If logged in but no roles set, User
  if (!myUser.roles || !myUser.isLoggedIn) { return UserRole.Guest; }
  if (myUser.roles.length === 0 && myUser.isLoggedIn) { return UserRole.User; }

  const highest = UserRole.User;
  return highest;

}

export function requireLogin(myUser: MyUserDocument): void {
  if(!myUser) { throw { code: 403, message: "You must be logged in to perform this action." }; }
}
