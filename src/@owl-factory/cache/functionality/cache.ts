import { isError } from "@owl-factory/errors";
import { Ref64 } from "@owl-factory/types";
import { CacheController } from "../AbstractCacheController";
import { load, remove, save } from "../storage/localStorage";
import { CacheItem, CacheItemMetadata, RefRequired } from "../types";

/**
 * Loads documents from the cache into memory
 */
export function loadCache<T extends RefRequired>(this: CacheController<T>) {
  const docs = load<T>(this.key);
  this.$setMany(docs, false);
}

/**
 * Reads the updated version of an item from the database if it is stale, otherwise returns the existing item
 * @param item The currently existing item, if any
 * @param meta The metadata for the current item
 * @param staleTime The maximum time allowed since the last load
 * @returns The item
 */
 export async function $readIfStale<T extends RefRequired>(
  this: CacheController<T>,
  cacheItem: CacheItem<T>,
  staleTime: number
): Promise<CacheItem<T> | undefined> {
  // If it's not loaded right now, then we'll assume that there's an issue elsewhere
  if (!cacheItem || !cacheItem.doc || cacheItem.doc.ref) { return cacheItem; }

  if (cacheItem.meta.loadedAt > Date.now() - staleTime) { return cacheItem; }
  const newCacheItem = await this.read(cacheItem.doc.ref as string);
  if (newCacheItem === undefined) { return undefined; }
  const retrievedCacheItem = this.$data[cacheItem.doc.ref as string];
  return retrievedCacheItem;
}

/**
 * Reads the full version of an item from the database if it is unloaded, otherwise returns the existing item
 * @param item The currently existing item, if any
 * @param meta The metadata for the current item
 * @returns The item
 */
export async function $readIfUnloaded<T extends RefRequired>(
  this: CacheController<T>,
  cacheItem?: CacheItem<T>
): Promise<CacheItem<T> | undefined> {
  // Base case: undefined item
  if (!cacheItem) { return cacheItem; }
  // Base case: return if no ref is present (somehow)
  if (!cacheItem.doc || !("ref" in cacheItem.doc)) { return cacheItem; }
  if (cacheItem.meta.isLoaded) { return cacheItem; }

  const newCacheItem = await this.read(cacheItem.doc.ref as string);
  if (isError(newCacheItem)) { return undefined; }
  const retrievedCacheItem = this.$data[cacheItem.doc.ref as string];
  return retrievedCacheItem;
}


/**
 * Removes many documents from the cache
 * @param refs The list of refs of documents to remove, if present
 * @param saveToCacheStorage Whether or not to delete the refs from the cache storage. Default is true
 */
export function $removeMany<T extends RefRequired>(
  this: CacheController<T>,
  refs: Ref64[],
  saveToCacheStorage = true
): void {
  if (refs === undefined || refs.length === 0) { return; }

  refs.forEach((ref: Ref64) => {
    if (this.$data[ref]) {
      delete this.$data[ref];
    }
  });

  if (saveToCacheStorage) {
    remove(this.key, refs);
  }
  this.$touch();
  return;
}

/**
 * Saves the given items and their metadata into the cache. This is the internal method
 * @param cacheItems The items to place or update in the cache, in the standard cache format
 * @param saveToCacheStorage Ensures that the new items are saved to cache storage (eg local storage). Default: true.
 */
export function $setMany<T extends RefRequired>(
  this: CacheController<T>,
  cacheItems: CacheItem<T>[],
  saveToCacheStorage = true
): void {
  if (cacheItems === undefined || cacheItems.length === 0) { return; }
  cacheItems.forEach((cacheItem: CacheItem<T>) => {
    if (!cacheItem || !cacheItem.doc || !("ref" in cacheItem.doc)) { console.log("fail");return; }

    const ref = cacheItem.doc.ref as string;
    this.$data[ref] = cacheItem;
  });

  // Saves this list to the cache
  if (saveToCacheStorage) { save<CacheItem<T>>(this.key, cacheItems); }
  this.$touch();
}


/**
 * Converts an array of documents to cache items
 * @param docs The documents to convert into standard cache items
 * @param meta The standard metadata package, if any, to apply to each of the documents
 * @returns An array of the new cache items
 */
export function $toCacheItem<T extends RefRequired>(
  this: CacheController<T>,
  docs: Partial<T>[],
  meta?: CacheItemMetadata
): CacheItem<T>[] {
  const cacheItems: CacheItem<T>[] = [];

  const metadata = meta !== undefined ? { ...meta } : {
    isLoaded: false,
    loadedAt: 0,
    updatedAt: 0,
  };
  metadata.updatedAt = Date.now();

  docs.forEach((doc: Partial<T>) => {
    if (!doc.ref) { return; }
    const cacheItem: CacheItem<T> = {
      ref: doc.ref,
      doc: doc,
      meta: metadata,
    };
    cacheItems.push(cacheItem);
  });

  return cacheItems;
}
