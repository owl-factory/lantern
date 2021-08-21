import { MyUserDocument } from "server/logic";
import { AnyDocument } from "types/documents";

export type FunctionConfig = any;
export interface IndexConfig extends FunctionConfig {
  // indexFields: string[][];
}

export type FieldConfig = any;
export type RoleConfig = any;

export type FieldValue = string[] | ((myUser: MyUserDocument, doc?: AnyDocument) => string[]);
export type RoleValue = boolean | ((myUser: MyUserDocument, doc?: AnyDocument) => boolean);

export enum FunctionType {
  CREATE,
  DELETE,
  FETCH,
  UPDATE,
  SEARCH
}

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
