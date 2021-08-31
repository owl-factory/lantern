import { Expr } from "faunadb";
import { FaunaRef } from "types/fauna";
import { MyUserDocument } from "types/security";

/**
 * Adds a user to the terms
 * @param terms The prexisting terms
 * @param myUser The user to add to the terms
 * @returns The existing terms, with the user's ref added on
 */
export function myUserToTerm(terms: (string | Expr)[], myUser: MyUserDocument) {
  terms.push(myUser.ref as Expr);
  return terms;
}

interface IdCollectionRef {
  id: string;
  collection: string;
}

interface RefRef {
  ref: FaunaRef;
}

export type DocumentReference = IdCollectionRef |& RefRef;
