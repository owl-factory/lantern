import { Expr } from "faunadb";
import { FaunaRef } from "types/fauna";
// TODO - move role stuff to proper enum files
/**
 * The different kinds of roles a user may have
 */
export enum UserRole {
  GUEST = -1,
  USER = 0,
  MODERATOR=75,
  ADMIN=100
}

/**
 * The readable names for the different kinds of user roles
 */
export const UserRoleReadable = [
  "guest",
  "user",
  "moderator",
  "admin",
];

/**
 * A user document for easily verifying what a user has access to, if they are logged in, and their highest role
 */
export interface MyUserDocument {
  id: string,
  collection: "users",
  ref: FaunaRef | Expr,
  role: UserRole,
  isLoggedIn: boolean;
}
