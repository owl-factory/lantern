import * as fauna from "@owl-factory/database/utilities/integration/fauna";
import { Ref64 } from "@owl-factory/types";

/**
 * Creates a document and ensures that it exists before returning. Otherwise throws an error.
 * @param doc The document to create
 * @returns The created document
 */
export async function create<T>(collection: string, doc: Partial<T>): Promise<T> {
  const newDoc = await fauna.createOne<T>(collection, doc);
  if (newDoc === undefined) {
    const name = ("name" in doc) ? (doc as any).name : "undefined";
    throw `A document in collection '${collection}' with name '${name}' could not be created`;
  }
  return newDoc;
}

/**
 * Deletes and returns a document. Throws an error on failure.
 * @param ref The ref of the document to delete
 * @returns The deleted document
 */
export async function remove<T>(collection: string, ref: Ref64): Promise<T> {
  const deletedDoc = await fauna.deleteOne<T>(ref);
  if (deletedDoc === undefined) {
    throw `A document in collection '${collection}' with ref '${ref}' could not be deleted`;
  }
  return deletedDoc;
}

/**
 * Fetches and returns a document. Throws an error if the document was not found
 * @param ref The ref of the document to fetch
 * @returns The fetched document
 */
export async function fetch<T>(collection: string, ref: Ref64): Promise<T> {
  const doc = await fauna.findByID<T>(ref);
  if (doc === undefined) {
    throw `A document in collection '${collection}' with ref '${ref}' could not be found`;
  }
  return doc;
}

/**
 * Updates a document and returns the result. Throws an error if the document fails to update
 * @param ref The ref of the document to update
 * @param doc The changes to make in the document
 * @returns The full updated document
 */
export async function update<T>(
  collection: string,
  ref: Ref64,
  doc: Partial<T>,
  optional?: { credentials?: string }
): Promise<T> {
  const updatedDoc = await fauna.updateOne<T>(ref, doc, optional);
  if (updatedDoc === undefined) {
    throw `A document in collection '${collection}' with ref '${ref}' could not be updated`;
  }
  return updatedDoc;
}
