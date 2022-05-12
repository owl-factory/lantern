import { Auth } from "controllers/auth";
import { AnyDocument } from "types/documents";

export function skeletonKeyFields(doc: any) { return ["*"]; }

/**
 * Checks if the current user is the owner of the current document
 * @param doc The document to check
 * @param myUser The current user object to check for ownership
 */
export function isPublic(doc?: Partial<AnyDocument>): boolean {
  if (!doc || !("isPublic" in doc)) { return false; }
  return doc.isPublic || false;
}

