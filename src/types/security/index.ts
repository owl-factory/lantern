import { Expr } from "faunadb";
import { FaunaRef } from "types/fauna";

/**
 * The different kinds of roles a user may have
 */
export enum UserRole {
  GUEST = 0,
  USER,
  MOD,
  ADMIN
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
  roles: string[];
  role: UserRole,
  isLoggedIn: boolean;
}
