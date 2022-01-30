import { Auth } from "controllers/auth";
import { AnyDocument } from "types/documents";

/**
 * Checks if the current user is the owner of the current document
 * @param doc The document to check
 * @param myUser The current user object to check for ownership
 */
 export function isOwner(doc?: AnyDocument): boolean {
  if (!doc) { return false; }
  return (!doc.ownedBy || doc.ownedBy.ref === Auth.user?.ref);
}

