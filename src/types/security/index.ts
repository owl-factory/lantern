import { UserRole } from "@owl-factory/auth/enums";
import { FaunaRef } from "@owl-factory/database/types/fauna";
import { Expr } from "faunadb";
// TODO - move role stuff to proper enum files


/**
 * A user document for easily verifying what a user has access to, if they are logged in, and their highest role
 */
export interface MyUserDocument {
  id: string,
  collection: "users",
  ref: FaunaRef | Expr, // TODO - see if we can't get rid of this or convert it into an id
  role: UserRole,
  roles: UserRole[],
  isLoggedIn: boolean;
}
