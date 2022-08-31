import { isValidCollection, isValidRef } from "@owl-factory/data/utilities/fields";
import { Ref64 } from "@owl-factory/types";
import { CrudPacket } from "@owl-factory/types/object";
import { deepMerge } from "@owl-factory/utilities/objects";
import { updateOne } from "../integration/fauna";
import { getDefaultDocument, getMigrations, getVersion } from "../migrations/fauna/access";
import { runDocumentMigrations } from "../migrations/fauna/migrate";
import {
  setCreateFields,
  setUpdateFields,
  trimReadFields,
  trimSetFields,
  validateDocument,
  validateDynamicAccess,
  validateLogin,
  validateStaticAccess,
} from "./actions";
import { LogicDescriptor } from "./types";

/**
 * Wraps a function to create a document to verify that a user has access to create a document
 * @param descriptor An object containing information for creating a document
 * @param original The original function that this function wraps
 * @param doc The document being created
 * @returns A CrudPacket describing the success of fetching a document
 */
export async function createWrapper(
  descriptor: LogicDescriptor,
  original: (doc: any) => Promise<any>,
  doc: any
): Promise<any> {
  descriptor.requireLogin = true;

  // Check login & static permissions
  validateLogin(descriptor);
  validateStaticAccess(descriptor);

  validateDocument(descriptor, doc);

  // Ensures that required fields are set and that no extra fields are set.
  doc = trimSetFields(descriptor, doc);
  doc = deepMerge(doc, getDefaultDocument(descriptor.collection));
  doc = setCreateFields(doc);

  // Run original function
  let result = await original(doc);

  // Read Fields
  result = trimReadFields(descriptor, result);

  return result;
}

/**
 * Wraps a function to delete a document to verify that a user has access to run the original function
 * @param descriptor An object containing information for deleting a document
 * @param original The original function that this function wraps
 * @param ref The ref of the document to delete
 * @returns A CrudPacket describing the success of deleting a document
 */
export async function deleteWrapper(
  descriptor: LogicDescriptor,
  original: (ref: string) => Promise<any>,
  ref: Ref64
): Promise<CrudPacket<any>> {
  descriptor.requireLogin = true;

  // Validate ref
  if (!isValidRef(ref)) { throw `The ref '${ref}' is not valid`; }
  // Validate collection
  if (!isValidCollection(ref, descriptor.collection)) { throw `The collection within '${ref}' is not valid`; }

  // Check login
  validateLogin(descriptor);
  // Check static permission
  validateStaticAccess(descriptor);

  if (!descriptor.fetch) { throw `A fetch function is required for the delete function`; }
  const doc = await descriptor.fetch(ref);
  if (!doc) { throw `A document with ref '${ref}' could not be found`; }

  // Dynamic check
  validateDynamicAccess(descriptor, doc);

  // Run original function
  let result = await original(ref);

  // Read Fields
  result = trimReadFields(descriptor, result);

  return result;
}

/**
 * Wraps a function to fetch a document to verify that a user has access to a document before returning it
 * @param descriptor An object containing information for validating access to a document
 * @param original The original function that this function wraps
 * @param ref The ref of the document being fetched
 * @returns A CrudPacket describing the success of fetching a document
 */
export async function fetchWrapper(
  descriptor: LogicDescriptor,
  original: (ref: string) => Promise<any>,
  ref: Ref64
): Promise<CrudPacket<any>> {

  // Validate ref and collection
  if (!isValidRef(ref)) { throw `The ref '${ref}' is not valid`; }
  if (!isValidCollection(ref, descriptor.collection)) { throw `The collection within '${ref}' is not valid`; }

  // Check login & static permission
  validateLogin(descriptor);
  validateStaticAccess(descriptor);

  // Run original function
  let result = await original(ref);

  result = await verifyVersion(descriptor.collection, result);

  // Check we can read the document and restrict what fields are sent back
  validateDynamicAccess(descriptor, result);
  result = trimReadFields(descriptor, result);

  return result;
}

/**
 * Wraps a function to fetch a document to verify that a user has access to a document before returning it
 * @param descriptor An object containing information for validating access to a search index
 * @param original The original function that this function wraps
 * @param args The args for the search function being run
 * @returns A CrudPacket describing the success of fetching an array of documents
 */
export async function searchWrapper(
  descriptor: LogicDescriptor,
  original: (args: any) => Promise<any[]>,
  args: any
) {

  // Check login & static permission
  validateLogin(descriptor);
  validateStaticAccess(descriptor);

  // Run original function
  const result = await original(args[0]);

  // Check we can read the document and restrict what fields are sent back
  const compiledResult: any[] = [];
  for (const doc of result) {
    try {
      validateDynamicAccess(descriptor, doc);
      compiledResult.push(trimReadFields(descriptor, doc));
    } catch (e) {
      continue;
    }
  }

  return compiledResult;
}

/**
 * Wraps a function to update a document to verify that a user has access to run the original function
 * @param descriptor An object containing information for updating a document
 * @param original The original function that this function wraps
 * @param ref The ref of the document to update
 * @param doc The changes to implement in the document
 * @returns A CrudPacket describing the success of updating a document
 */
export async function updateWrapper(
  descriptor: LogicDescriptor,
  original: (ref: string, doc: any) => Promise<any>,
  ref: Ref64,
  doc: any
): Promise<CrudPacket<any>> {
  descriptor.requireLogin = true;

  // Validate ref & collection
  if (!isValidRef(ref)) { throw `The ref '${ref}' is not valid`; }
  if (!isValidCollection(ref, descriptor.collection)) { throw `The collection within '${ref}' is not valid`; }

  // Check login and static access
  validateLogin(descriptor);
  validateStaticAccess(descriptor);
  validateDocument(descriptor, doc);

  // Check that the user can access the original document
  if (!descriptor.fetch) { throw `A fetch function is required for the update function`; }
  const originalDoc = await descriptor.fetch(ref);
  if (!originalDoc) { throw `A document with ref '${ref}' could not be found`; }
  validateDynamicAccess(descriptor, doc);
  doc = trimSetFields(descriptor, doc);
  doc = setUpdateFields(doc);

  // Run original function
  let result = await original(ref, doc);

  // Read Fields
  result = trimReadFields(descriptor, result);

  return result;
}

/**
 * Verifies that the document is on the latest version and migrates it if not
 * @param collection The collection the document belongs to
 * @param doc The document to verify the version of
 * @returns The document, migrated to the latest version
 */
async function verifyVersion(collection: string, doc: any) {
  if (doc._v !== undefined && getVersion(collection) <= doc._v) { return doc; }
  doc = runDocumentMigrations(doc, getMigrations(collection));
  doc = await updateOne<any>(doc.ref, doc);
  return doc;
}
