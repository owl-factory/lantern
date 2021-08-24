import { AnyDocument } from "types/documents";
import { MyUserDocument } from "types/security";

/**
 * Checks if the current user is an admin
 * @param myUser The current user object to check
 */
export function isAdmin(myUser: MyUserDocument): boolean {
  return (myUser.roles.includes("admin"));
}

/**
 * Checks if the current user is the owner of the current document
 * @param doc The document to check
 * @param myUser The current user owbject to check for ownership
 */
export function isOwner(myUser: MyUserDocument, doc?: AnyDocument): boolean {
  if (!doc) { return false; }
  return (!doc.ownedBy || doc.ownedBy.id === myUser.id);
}

