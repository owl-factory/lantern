
import { AnyDocument } from "types/documents";
import { MyUserDocument } from "types/security";

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
  FETCH_MANY,
  UPDATE,
  SEARCH
}

