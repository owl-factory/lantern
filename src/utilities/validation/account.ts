import { Auth } from "controllers/auth";
import { UserDocument } from "types/documents";

/**
 * Requires the current user to be logged in
 * @throws An error if the current user is not logged in
 */
export function requireLogin() {
  if (Auth.isLoggedIn) { return; }
  throw "You must be logged in to perform this action";
}

/**
 * Checks that the user has the given permission
 * @param permission The permission to check against the current user's list of permissions
 * @throws An error if the current user does not have the given permission
 */
export function requirePermission(permission?: string) {
  // Case to ignore this functionality.
  // TODO - throw warning
  if (!permission) { return; }
  if (Auth.hasPermission(permission)) { return; }
  throw "You do not have sufficient access to perform this action";
}

/**
 * Checks if the given user document has the space available to store the exepected size
 * @todo
 * @param account The user account to check storage freedom
 * @param expectedSize The expected size of the new file being added (in bytes)
 * @throws An error if the account does not have the space requirements
 */
export function validateAccountHasSpace(account: UserDocument, expectedSize: number) {
  return;
}
