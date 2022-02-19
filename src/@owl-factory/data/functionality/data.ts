import { canLoad, DataManager } from "../AbstractDataManager";
import { ReloadPolicy } from "../enums";
import { SearchParams } from "../types";

type GenericRecord = Record<string, unknown>;

/**
 * Clears all data from the data manager, groups, and cache.
 * @public
 */
export function clear(this: DataManager<GenericRecord>) {
  this.$data = {};
  this.$clearGroups();
  this.$clearCache();

  return;
}

/**
 * Gets a single document from the data manager
 * @public
 * @param ref The reference of the document to fetch
 * @returns The found document, if present. Undefined otherwise
 */
export function get<T extends GenericRecord>(this: DataManager<T>, ref: string | undefined): T | undefined {
  if (ref === undefined) { return undefined; }
  if (!(ref in this.$data)) { return undefined; }
  return this.$data[ref].doc;
}

/**
 * Gets multiple documents from the data manager. If a document is not found, then it is not added to the list
 * @public
 * @param ref The reference of the document to fetch
 * @returns The found document, if present. Undefined otherwise
 */
 export function getMany<T extends GenericRecord>(this: DataManager<T>, refs: string[]): T[] {
  const docs: T[] = [];
  for (const ref of refs) {
    if (ref === undefined) { continue; }
    const doc = this.get(ref);
    if (!doc) { continue; }
    docs.push(doc);
  }

  return docs;
}

/**
 * Ensures one or many documents are loaded into the data manager
 * @async
 * @public
 * @param targetRef The reference of the document to load
 * @param reloadPolicy A reload policy to use instead of the default
 * @returns True if the load was successful. False otherwise
 */
export async function load(
  this: DataManager<GenericRecord>,
  targetRef: string | string[],
  reloadPolicy: ReloadPolicy = this.reloadPolicy
): Promise<boolean> {
  const refs = Array.isArray(targetRef) ? targetRef : [targetRef];
  const loadRefs: string[] = [];

  // Checks which documents to we can load
  for (const ref of refs) {
    const cacheItem = this.$data[ref];
    if (!cacheItem) { continue; }
    if (canLoad(cacheItem, reloadPolicy, this.staleTime)) { loadRefs.push(ref); }
  }

  // Prevents unneeded calls from being made if the target refs are empty
  if (loadRefs.length === 0) { return true; }

  const docs = await this.loadDocuments(loadRefs);
  if (!Array.isArray(docs) || docs.length === 0) { return false; } // Unexpected error

  // Set Many
  return this.$setMany(docs, true);
}

/**
 * Searches through the data and finds documents that match the search criteria
 * @param params The parameters to use for searching, sorting, and paginating
 * @returns An array of documents matching the criteria
 */
export function search<T extends GenericRecord>(this: DataManager<T>, params?: SearchParams): string[] {
  let group: string[] = [];

  if (!params) { return []; }

  if (params.group === "data") { group = Object.keys(this.$data); }
  else if (!params.group || !(params.group in this.$groups)) { return []; }
  else { group = this.$groups[params.group]; }

  // TODO - actual sorting & filtering

  return group;
}

/**
 * Adds a single document to the data manager. Merges with any existing document if newer and replaces if older.
 * @public
 * @param doc The document to set in the data manager
 * @param loaded If this is the full document that a user can get -- eg, it is fully loaded. If not, false. 
 */
export function set<T extends GenericRecord>(this: DataManager<T>, doc: T, loaded = false): void {
  this.setMany([doc], loaded);
}

/**
 * Sets many document in the data manager. Merges them with any existing document if newer, and replaces if older.
 * @param docs A list of documents to add to the data manager
 * @param loaded If these are the full document that a user can get -- eg, it is fully loaded. If not, false.
 * This applies to all; if one document is not fully loaded, either exclude and run with set or a seperate
 * setMany call, or mark all as false. Loaded documents can be marked as unloaded, but unloaded documents can
 * never be marked loaded.
 */
export function setMany<T extends GenericRecord>(this: DataManager<T>, docs: T[], loaded = false): void {
  this.$setMany(docs, loaded);
}
