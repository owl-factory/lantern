
import { AnyDocument } from "types/documents";
import { trimFields } from "utilities/security";
import * as fauna from "../integration/fauna";
import { Ref64 } from "@owl-factory/types";
import { Auth } from "controllers/auth";

export type AccessFunction<T> = (doc: AnyDocument) => T
export type AccessFieldValue<T> = T | AccessFunction<T>


export interface Descriptor {
  access?: AccessFieldValue<boolean>;
  requireLogin?: boolean;
  role?: string;
  parent?: any;
  readFields?: AccessFieldValue<string[]>;
  setFields?: AccessFieldValue<string[]>;
}

/**
 * Checks if the overarching function requires the user to be logged in. Throws an error on failure
 * @param descriptor The descriptor of the database logic function being processsed
 */
 export function checkLogin(descriptor: Descriptor): void {
  // Nabs the login requirement. If requireLogin is present, use it, but then default to true
  const isLoginRequired = descriptor.requireLogin !== undefined ?  descriptor.requireLogin : false;
  if (isLoginRequired === false) { return; }
  if (!Auth.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to view this resource."};
  }
}

/**
 * Checks if a per role access is static or dynamic.
 * @param perRoleAccess The per role access item to check for a static value or a function
 * @returns Boolean. True if the function is static. False if it is dynamic.
 */
function _isStatic(perRoleAccess: AccessFieldValue<unknown>) {
  if (typeof perRoleAccess === "function") { return false; }
  return true;
}

/**
 * Checks if the current user has access, dynamic or static, to the given document.
 * Throws an error if access is not permitted
 * @param descriptor The descriptor of the database logic function being processsed
 * @param doc The document to check the access for
 */
export function checkDynamicAccess(descriptor: Descriptor, doc: AnyDocument): AnyDocument {
  const docs = checkManyDynamicAccess(descriptor, [doc]);
  if (docs.length === 0) {
    throw { code: 401, message: "You do not have access to view this resource." };
  }
  return docs[0];
}

/**
 * Checks if the current user has permission allowing them to access this function
 * @param descriptor The descriptor of the current function being run
 */
export function checkPermissionAccess(descriptor: Descriptor): void {
  if (!descriptor.role) { return; }
  if (!Auth.hasPermission(descriptor.role)) {
    throw { code: 401, message: "You lack the permission to run this function." };
  }
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

  // Checks if the access property is static. If so, exits out with all or nothing to prevent unneeded processing
  if (_isStatic(descriptor.access)) {
    if (descriptor.access === true) { return docs; }
    return [];
  }

  const approvedDocs: AnyDocument[] = [];
  const accessFunction = descriptor.access as (doc: AnyDocument) => boolean;
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

export async function fetchTargetDoc(descriptor: Descriptor, id: Ref64): Promise<AnyDocument | undefined> {
  const doc = await fauna.findByID<AnyDocument>(id);
  return doc;
}

/**
 * Sets the fields required on creation. Returns the updated document
 * @param doc The document to add the fields to
 */
export function setCreateFields(_descriptor: Descriptor, doc: Partial<AnyDocument>): Partial<AnyDocument> {
  doc.createdAt = new Date();
  doc.createdBy = { ref: Auth.user?.ref || "" };
  doc.ownedBy = { ref: Auth.user?.ref || "" };
  doc = setUpdateFields(_descriptor, doc);
  return doc;
}

/**
 * Sets the fields required on update. Returns the updated document
 * @param doc The document to add the fields to
 */
export function setUpdateFields(_descriptor: Descriptor, doc: Partial<AnyDocument>): Partial<AnyDocument> {
  doc.updatedAt = new Date();
  doc.updatedBy = { ref: Auth.user?.ref || "" };
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

  const trimmedDocs = _trimManyFields(descriptor.readFields, docs);
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

  const trimmedDocs = _trimManyFields(descriptor.setFields, docs);
  return trimmedDocs;
}

/**
 * Trims the fields of many documents.
 * @param roleFields The PerRoleAccess function or fields.
 * @param docs The array of documents to trim fields from
 * @returns An array of documents with some or all of the fields they entered with
 */
function _trimManyFields(
  roleFields: AccessFieldValue<string[]> | undefined,
  docs: AnyDocument[]
): Partial<AnyDocument>[] {
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
