import { AnyDocument } from "types/documents";
import { MyUserDocument, UserRole, UserRoleReadable } from "types/security";
import { RoleConfig } from "../types";

/**
 * Determines and returns the highest role of the currently logged in user
 * @param myUser The currently logged in user
 * @returns The highest role of the currently logged in user
 */
export function getRole(myUser: MyUserDocument) {
  if (!myUser || !myUser.isLoggedIn) { return UserRole.Guest; }
  const highestRole = UserRole.User;
  // myUser.roles.forEach((role: string) => {
  //   UserRoleReadable.forEach((readableRole: string, index: number) => {
  //     if (role.toLowerCase() === readableRole && index > highestRole) {
  //       highestRole = index;
  //     }
  //   });
  // });
  return highestRole;
}

/**
 * Checks the there is function configuration. Throws an error if there is none
 * @param config The function configuration to check
 */
export function checkConfig(config: unknown) {
  if (config === undefined) {
    throw { code: 501, message: "This method does not exist." };
  }
}

/**
 * Determines if a role is able to act on a document without attempting to read the document first. If the role config
 * is a boolean, return that boolean. If it is a function, return true to fetch and check in the non-static function.
 * For example, a guest trying to write a campaign will fail as they will never have permissions to do that
 *
 * @param myUser The document of the user attempting to fetch the data
 * @param roleConfig The role configuration for determining if the user is able to access something
 */
export function canActStatic(myUser: MyUserDocument, roleConfig: RoleConfig) {
  // TODO - Check if role is not present in myUser?
  if (typeof roleConfig[myUser.role] === "boolean") { return roleConfig[myUser.role]; }
  return true;
}

/**
 * Takes in a list of documents and determines if the user can act on them. Those that can are returned in a new,
 *  seperate list.
 * @param docs A list of documents to check if the user has individual access to perform an action on them
 * @param myUser The user attempting to perform an action on the documents
 * @param roleConfig The Role Configuration describing who
 */
export function canActOn(docs: AnyDocument[], myUser: MyUserDocument, roleConfig: RoleConfig): AnyDocument[] {
  const approvedDocs: AnyDocument[] = [];
  docs.forEach((doc: AnyDocument) => {
    if (canAct(doc, myUser, roleConfig)) { approvedDocs.push(doc); }
  });
  return approvedDocs;
}

/**
 * Determines if the current user can act upon the given document as defined by the role configuration
 * @param doc The document to validate actions upon
 * @param myUser The current user attempting to act on the document
 * @param roleConfig The Role Configuation that determines the rules of action
 */
export function canAct(doc: AnyDocument | null, myUser: MyUserDocument, roleConfig: RoleConfig) {
  if (doc === null) { return false; }
  if (!myUser) { return false; }

  const roleCheck = roleConfig[myUser.role];

  if (typeof roleCheck === "boolean") { return roleCheck; }
  return roleCheck(myUser, doc);
}
