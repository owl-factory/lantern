import { Expr } from "faunadb";
import { FaunaRef } from "types/fauna";

export enum UserRole {
  GUEST = 0,
  USER,
  MOD,
  ADMIN
}

export const RoleReadable = [
  "guest",
  "user",
  "moderator",
  "admin",
];


export interface MyUserDocument {
  id: string,
  collection: "users",
  ref: FaunaRef | Expr,
  roles: string[];
  role: UserRole,
  isLoggedIn: boolean;
}
