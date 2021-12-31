import { Ref64 } from "@owl-factory/types";
import { CacheController } from "../AbstractCacheController";
import { PassiveReadLevel } from "../enums";
import { CacheItem, GetPageOptions, RefRequired } from "../types";

/**
 * Fetches a single item from the database
 * @param ref The ref of the item
 * @param readLevel The Passive Read Level rule for when to fetch the object from the database
 * @param staleTime The amount of time in milliseconds that the cache should wait before attempting to fetch
 *  fresh data (ReadLevel.IfStale only)
 * @returns The item, either a partial or a full document
 */
export function get<T extends RefRequired>(
  this: CacheController<T>,
  ref: Ref64 | undefined,
  readLevel: PassiveReadLevel = this.passiveReadLevel,
  staleTime: number = this.staleTime
): Partial<T> | undefined {
  if (ref === undefined) { return undefined; }

  // Fetches the ref if it's not present in the cache or if the read is forced
  if (!(ref in this.$data)) {
    this.read(ref);
    return undefined;
  }

  const cacheItem: CacheItem<T> | undefined = this.$data[ref];
  if (cacheItem === undefined) { return undefined; } // Safety case, though it should never be hit

  // TODO - security. Also prevent repeated attempts to access the data

  switch(readLevel) {
    case PassiveReadLevel.Never:
      return cacheItem.doc;

    case PassiveReadLevel.IfUnloaded:
      this.$readIfUnloaded(cacheItem);
      return cacheItem?.doc;

    case PassiveReadLevel.IfStale:
      this.$readIfStale(cacheItem, staleTime).then((unstaleCacheItem: CacheItem<T> | undefined) => {
        this.$readIfUnloaded(unstaleCacheItem);
      });
      return cacheItem?.doc;
  }
}

/**
 * Gets many documents from a given list of refs
 * @param refs The list of refs to fetch
 * @returns A list of the requested partial documents
 */
export function getMany<T extends RefRequired>(this: CacheController<T>, refs: Ref64[]): Partial<T>[] {
  const docs: Partial<T>[] = [];
  refs.forEach((ref: Ref64) => {
    const cacheItem = this.$data[ref];
    if (cacheItem && cacheItem.doc) {
      docs.push(cacheItem.doc);
    }
  });

  return docs;
}

/**
 * Fetches a single page of documents
 * TODO - add options for the size and number of pages
 * @returns An array of documents for a single page
 */
export function getPage<T extends RefRequired>(this: CacheController<T>, options: GetPageOptions = {}): Partial<T>[] {
  const page: Partial<T>[] = [];
  Object.keys(this.$data).forEach((key: string) => {
    if (options.size !== undefined && page.length >= options.size) { return; }
    if (options.match) {
      if (options.match(this.$data[key])) {
        page.push(this.$data[key].doc);
      }
      return;
    }

    page.push(this.$data[key].doc);
  });
  return page;
}
/**
 * Reads documents that are missing from the data manager
 * @param refs All refs, not necessarily missing ones, to check and fetch
 * @returns A list of documents pulled from the database
 */
export async function readMissing<T extends RefRequired>(this: CacheController<T>, refs: string[]) {
  const missingRefs: string[] = [];
  refs.forEach((ref: Ref64) => {
    if (!(ref in this.$data)) { missingRefs.push(ref); }
  });
  if (refs.length === 0) { return []; }

  return this.readMany(missingRefs);
}

/**
 * Sets a document in the data manager. Updates both the data manager and the instance in local storage
 * @param doc The document to add or update in the data manager
 */
export function set<T extends RefRequired>(this: CacheController<T>, doc: Partial<T>): void {
  this.setMany([doc]);
}

/**
 * Sets many documents in the data manager and the storage method
 * @param docs The documents to set in the data manager and the storage method
 */
export function setMany<T extends RefRequired>(this: CacheController<T>, docs?: Partial<T>[]): void {
  if (docs === undefined) { docs = []; }
  const cacheItems: CacheItem<T>[] = this.$toCacheItem(docs, { isLoaded: false, loadedAt: 0, updatedAt: Date.now()});

  this.$setMany(cacheItems);
}
