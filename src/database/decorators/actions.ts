import { SecurityController } from "controllers/security";
import { AnyDocument } from "types/documents";
import { UserRole } from "types/security";
import { read, set } from "utilities/objects";
import { trimFields } from "utilities/security";

type PerRoleAccess<T> = T | ((doc: AnyDocument) => T);
type RoleAccess<T> = Record<UserRole, PerRoleAccess<T> | undefined>;
interface Descriptor {
  access?: RoleAccess<boolean>;
  requireLogin?: boolean;
  readFields?: RoleAccess<string[]>;
  setFields?: RoleAccess<string[]>;
}

/**
 * Checks if the overarching function requires the user to be logged in. Throws an error on failure
 * @param descriptor The descriptor of the database logic function being processsed
 */
 export function checkLogin(descriptor: Descriptor): void {
  // Nabs the login requirement. If requireLogin is present, use it, but then default to true
  const isLoginRequired = descriptor.requireLogin !== undefined ?  descriptor.requireLogin : false;

  if (isLoginRequired === false) { return; }
  if (!SecurityController.loggedIn) {
    throw { code: 401, message: "You must be logged in to view this resource."};
  }
}

/**
 * Checks if a per role access is static or dynamic.
 * @param perRoleAccess The per role access item to check for a static value or a function
 * @returns Boolean. True if the function is static. False if it is dynamic.
 */
function _isStatic(perRoleAccess: PerRoleAccess<unknown>) {
  if (typeof perRoleAccess === "function") { return false; }
  return true;
}

/**
 * Checks that the descriptor and current user has static access to the function. If access is false, an error is thrown
 * @param descriptor The descriptor of the database logic function being processsed
 */
export function checkStaticAccess(descriptor: Descriptor): void {
  // No access has been set, so skip any logic here
  if (!("access" in descriptor) || descriptor.access === undefined) { return; }

  // Ensure that the given role is a valid one
  const role = SecurityController.activeRole;
  if (!(role in descriptor.access)) {
    throw { code: 500, message: "The access type is missing the active role. This is an error with database logic." };
  }

  // Skip doing anything if this is a dynamic check
  if (!_isStatic(descriptor.access[role])) { return; }

  // Error out specifically if the current user does not have access
  if (descriptor.access[role] === false) {
    throw { code: 401, message: "You do not have access to this resource." };
  }

  return;
}

/**
 * Checks if the current user has access, dynamic or static, to the given document.
 * Throws an error if access is not permitted
 * @param descriptor The descriptor of the database logic function being processsed
 * @param doc The document to check the access for
 */
export function checkDynamicAccess(descriptor: Descriptor, doc: AnyDocument): void {
  const docs = checkManyDynamicAccess(descriptor, [doc]);
  if (docs.length === 0) {
    throw { code: 401, message: "You do not have access to view this resource." };
  }
}

/**
 * Gets the current role of the user. Also validates that the role exists in the role access. Throws an
 * error if it is not present
 * @param roleAccess The role access for no particular field
 * @returns The user's current role
 */
function _getRole(roleAccess: RoleAccess<unknown>) {
  const role = SecurityController.activeRole;
  if (!(role in roleAccess)) {
    throw { code: 500, message: "The access type is missing the active role. This is an error with database logic." };
  }
  return role;
}

/**
 * Checks if the current user has access, either dynamic or static, for each of the given documents.
 * Returns an array of all of the approved documents.
 * @param descriptor The descriptor of the database logic function being processsed
 * @param docs The array of document to check access for
 * @returns An array of all documents that the current user and role has access to
 */
export function checkManyDynamicAccess(descriptor: Descriptor, docs: AnyDocument[]): AnyDocument[] {
  // No access has been set, so skip any logic here
  if (!("access" in descriptor) || descriptor.access === undefined) { return docs; }
  const role = _getRole(descriptor.access);

  // Checks if the access property is static. If so, exits out with all or nothing to prevent unneeded processing
  if (_isStatic(descriptor.access[role])) {
    if (descriptor.access[role] === true) { return docs; }
    return [];
  }

  const approvedDocs: AnyDocument[] = [];
  const accessFunction = descriptor.access[role] as (doc: AnyDocument) => boolean;
  docs.forEach((doc: AnyDocument) => {
    if (accessFunction(doc)) {
      approvedDocs.push(doc);
    }
  });
  return approvedDocs;
}


export function checkParentAccess(descriptor: Descriptor, args: unknown): void {
  return;
}
  
export function fetchTargetDoc(descriptor: Descriptor, doc: AnyDocument): AnyDocument {
  return doc;
}

/**
 * Trims out the fields of a given document a user is not allowed to read
 * @param descriptor The descriptor of the database logic function being processsed
 * @param doc The document to trim fields from
 * @returns A single document with some or all of its fields trimmed
 */
export function trimReadFields(descriptor: Descriptor, doc: AnyDocument): Partial<AnyDocument> {
  const docs = trimManyReadFields(descriptor, [doc]);
  return docs[0];
}

/**
 * Trims out the fields of the given documents a user is not allowed to read
 * @param descriptor The descriptor of the database logic function being processsed
 * @param docs The documents to trim fields from
 * @returns An array of documents with some or all of their fields trimmed
 */
export function trimManyReadFields(descriptor: Descriptor, docs: AnyDocument[]): Partial<AnyDocument>[] {
  if (!("readFields" in descriptor) || descriptor.readFields === undefined) { return docs; }
  const role = _getRole(descriptor.readFields);

  const trimmedDocs = _trimManyFields(descriptor.readFields[role], docs);
  return trimmedDocs;
}

/**
 * Trims out the fields of a given document a user is not allowed to set
 * @param descriptor The descriptor of the database logic function being processsed
 * @param doc The document to trim fields from
 * @returns A single document with some or all of its fields trimmed
 */
export function trimSetFields(descriptor: Descriptor, doc: AnyDocument): Partial<AnyDocument> {
  const docs = trimManySetFields(descriptor, [doc]);
  return docs[0];
}

/**
 * Trims out the fields of the given documents a user is not allowed to set
 * @param descriptor The descriptor of the database logic function being processsed
 * @param docs The documents to trim fields from
 * @returns An array of documents with some or all of their fields trimmed
 */
export function trimManySetFields(descriptor: Descriptor, docs: AnyDocument[]): Partial<AnyDocument>[] {
  if (!("setFields" in descriptor) || descriptor.setFields === undefined) { return docs; }
  const role = _getRole(descriptor.setFields);

  const trimmedDocs = _trimManyFields(descriptor.setFields[role], docs);
  return trimmedDocs;
}

/**
 * Trims the fields of many documents.
 * @param roleFields The PerRoleAccess function or fields.
 * @param docs The array of documents to trim fields from
 * @returns An array of documents with some or all of the fields they entered with
 */
function _trimManyFields(roleFields: PerRoleAccess<string[]> | undefined, docs: AnyDocument[]): Partial<AnyDocument>[] {
  // Base case. Skips evaluation if the role fields haven't been defined
  if (roleFields === undefined) { return docs; }

  const trimmedDocs: Partial<AnyDocument>[] = [];
  const isStatic = _isStatic(roleFields);

  let fields: string[] = [];
  if (isStatic) { fields = roleFields as string[]; }

  docs.forEach((doc: AnyDocument) => {
    if (!isStatic) { fields = (roleFields as Function)(doc); }
    const trimmedDoc = trimFields<AnyDocument>(doc, fields);
    trimmedDocs.push(trimmedDoc);
  });

  return trimmedDocs;
}
