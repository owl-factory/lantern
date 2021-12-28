import { pruneErrors } from "@owl-factory/errors";
import { ResponseDoc } from "@owl-factory/types/object";
import { Ref64 } from "types";
import { getUniques } from "utilities/arrays";
import { rest } from "utilities/request";
import { CacheController } from "../AbstractCacheController";
import { RefRequired } from "../types";

/**
 * An internal function to create a new document from the database
 * @param doc The document to create from the database
 * @returns The completed document or an error explaining why it failed
 */
export async function create<T extends RefRequired>(
  this: CacheController<T>,
  doc: Partial<T>
): Promise<ResponseDoc<T>> {
  const docs = await this.createMany([doc]);
  return docs[0];
}

/**
 * An internal function to create one or more documents from the database
 * @param docs The documents to create from the database
 * @returns An array of documents or errors explaining why they failed
 */
export async function createMany<T extends RefRequired>(
  this: CacheController<T>,
  docs: Partial<T>[]
): Promise<ResponseDoc<T>[]> {
  const createdDocs = await this.$createMany(docs);
  const validDocs = pruneErrors<T>(createdDocs);
  const cacheItemDocs = this.$toCacheItem(validDocs, { isLoaded: true, loadedAt: Date.now(), updatedAt: Date.now() });
  this.$setMany(cacheItemDocs);
  return createdDocs;
}

/**
 * An internal function to delete a single document from the database
 * @param ref The ref of the document to delete from the database
 * @returns The deleted document or an error explaining why it could not be deleted
 */
export async function del<T extends RefRequired>(this: CacheController<T>, ref: Ref64): Promise<ResponseDoc<T>> {
  const docs = await this.deleteMany([ref]);
  return docs[0];
}

/**
 * An internal function to delete one or more documents from the database
 * @param refs The refs of the documents to delete from the database
 * @returns An array of the deleted documents or errors explaining why they could not be deleted
 */
export async function delMany<T extends RefRequired>(
  this: CacheController<T>,
  refs: Ref64[]
): Promise<ResponseDoc<T>[]> {
  const deletedDocs = await this.$deleteMany(refs);
  const validDocs = pruneErrors(deletedDocs);
  this.$removeMany(getUniques(validDocs, "ref"));

  return deletedDocs;
}

/**
 * Reads one document from the database
 * @param ref The ID of the document to read
 */
export async function read<T extends RefRequired>(
  this: CacheController<T>,
  ref: Ref64
): Promise<ResponseDoc<T> | undefined> {
  const docs = await this.$readMany([ref]);
  if (docs.length === 0) { return undefined; }
  return docs[0];
}

/**
 * Reads many documents from the database
 * @param refs The refs of the documents to read
 * @returns An unsorted array of all of the found documents
 */
export async function readMany<T extends RefRequired>(
  this: CacheController<T>,
  refs: string[]
): Promise<ResponseDoc<T>[]> {
  // Base case: skip any logic if no refs are present
  if (refs.length === 0) { return []; }

  const readDocs = await this.$readMany(refs);
  const validDocs = pruneErrors<Partial<T>>(readDocs);
  const cacheItemDocs = this.$toCacheItem(validDocs, { isLoaded: true, loadedAt: Date.now(), updatedAt: Date.now() });

  this.$setMany(cacheItemDocs);

  return readDocs;
}

/**
 * Updates a single document in the database
 * @param ref The ref of the document to update
 * @param doc The changed fields in the document to update
 * @returns The updated document or an error explaining why it could not be updated
 */
export async function update<T extends RefRequired>(
  this: CacheController<T>,
  ref: Ref64,
  doc: Partial<T>
): Promise<ResponseDoc<T>> {
  const docs = await this.updateMany([{ ref, doc }]);
  return docs[0];
}

/**
 * Updates one or many documents in the database
 * @param docs An array of document packages with a ref and changed fields instructing what documents to update
 * @returns An array of updated documents or errors explaining why they could not be updated
 */
export async function updateMany<T extends RefRequired>(
  this: CacheController<T>,
  docs: { ref: Ref64, doc: Partial<T> }[]
): Promise<ResponseDoc<T>[]> {
  const updatedDocs = await this.$updateMany(docs);
  const validDocs = pruneErrors<T>(updatedDocs);
  const cacheItemDocs = this.$toCacheItem(validDocs, { isLoaded: true, loadedAt: Date.now(), updatedAt: Date.now() });
  this.$setMany(cacheItemDocs);
  return updatedDocs;
}

type StandardApiResponse<T> = { docs: Partial<T>[] }


/**
 * The default background functionality for creating many documents. Can be overloaded to run different functions
 * without needing to change other functionality
 * @param docs The partial documents to create within the database
 * @returns The created documents as returned by the database
 */
export async function $createMany<T extends RefRequired>(this: CacheController<T>, docs: Partial<T>[]) {
  const result = await rest.put<StandardApiResponse<T>>(this.apiURL, { docs: docs });
  if (!result.success) { return []; }
  const createdDocs = result.data.docs;

  return createdDocs;
}

/**
 * The default background functionality for deleting many documents. Can be overloaded to run different functions
 * without needing to change other functionality
 * @param refs The refs for the documents to delete from the database
 * @returns The created documents as returned by the database
 */
export async function $deleteMany<T extends RefRequired>(this: CacheController<T>, refs: Ref64[]) {
  const result = await rest.delete<StandardApiResponse<T>>(this.apiURL, { refs: refs });
  if (!result.success) { return []; }
  const deletedDocs = result.data.docs;

  return deletedDocs;
}

/**
 * The default background functionality for reading many documents. Can be overloaded to run different functions
 * without needing to change other functionality
 * @param refs The refs for the documents to read from the database
 * @returns The created documents as returned by the database
 */
export async function $readMany<T extends RefRequired>(
    this: CacheController<T>,
    refs: Ref64[]
  ): Promise<ResponseDoc<T>[]> {
  const result = await rest.post<StandardApiResponse<T>>(this.apiURL, { refs: refs });
  if (!result.success) { return []; }
  const readDocs = result.data.docs;

  return readDocs;
}

/**
 * The default background functionality for creating many documents. Can be overloaded to run different functions
 * without needing to change other functionality
 * @param docs The partial documents to create within the database
 * @returns The created documents as returned by the database
 */
export async function $updateMany<T extends RefRequired>(
  this: CacheController<T>,
  docs: { ref: Ref64, doc: Partial<T> }[]
) {
  const result = await rest.patch<StandardApiResponse<T>>(this.apiURL, { docs: docs });
  if (!result.success) { return []; }
  const updatedDocs = result.data.docs;

  return updatedDocs;
}
