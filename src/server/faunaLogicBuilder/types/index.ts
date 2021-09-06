
import { AnyDocument } from "types/documents";
import { MyUserDocument } from "types/security";

export type FunctionConfig = any;

//TODO make this an interface that adds it's own functionality
export type IndexConfig = FunctionConfig

export type FieldConfig = any;
export type RoleConfig = any;

export type FieldValue = string[] | ((myUser: MyUserDocument, doc?: AnyDocument) => string[]);
export type RoleValue = boolean | ((myUser: MyUserDocument, doc?: AnyDocument) => boolean);

export enum FunctionType {
  CREATE,
  DELETE,
  FETCH,
  FETCH_MANY,
  UPDATE,
  SEARCH
}

