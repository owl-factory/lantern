import { getServerClient } from "utilities/db";
import { Expr, query as q } from "faunadb";
import { fromFauna, isFaunaError, parseFaunaRef, toFauna, toFaunaDate, toFaunaRef } from "utilities/fauna";
import { FaunaRef } from "types/fauna";
import { AnyDocument } from "types/documents";
import { set } from "utilities/objects";
import { UserRole } from "server/apiConfigBuilder/types";

interface IdCollectionRef {
  id: string;
  collection: string;
}

interface RefRef {
  ref: FaunaRef;
}

export type DocumentReference = IdCollectionRef |& RefRef;

export interface MyUserDocument {
  id: string,
  collection: "users",
  ref: FaunaRef | Expr,
  roles: string[];
  role: UserRole,
  isLoggedIn: boolean;
}

/**
 * Trims the given document to only have the given fields. All others are discarded.
 * TODO - refactor this so that multiple layers are allowed
 * TODO - move this to a more appropriate area
 * @param doc The document to trim
 * @param givenAllowedFields The given fields to keep, if any
 */
export function trimRestrictedFields(
  doc: Record<string, unknown>,
  givenAllowedFields: string[]
): Record<string, unknown> {
  const allowedFields = [
    "id", "collection", "ref", "name", "createdAt", "updatedAt", "ownedBy", "createdBy", "updatedBy",
  ].concat(givenAllowedFields);
  console.log("hiß")
  console.log(doc)

  const newDoc: any = {};
  allowedFields.forEach((allowedField: string) => {
    if (!(allowedField in doc)) { return; }
    newDoc[allowedField] = doc[allowedField];
  });

  return newDoc;
}
