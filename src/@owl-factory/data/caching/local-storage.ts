
// TODO - put into its own folder

import { CacheItem } from "@owl-factory/cache/types";
import { isClient } from "@owl-factory/utilities/client";

// Mocks up the window.localStorage to prevent breaks serverside
const mockLocalStorage = {
  clear: () => { return; },
  getItem: (_key: string) => { return undefined; },
  removeItem: (_key: string) => { return; },
  setItem: (_key: string, _value: any) => { return; },
};

const LOCAL_STORAGE = isClient ? window.localStorage : mockLocalStorage;

/**
 * Clears out all data for a given collection
 * @param collection The collection of the data to clear out
 */
export function clearCacheLocalStorage(collection: string): void {
  const refs = getIndexRefs(collection);

  for (const ref of refs) {
    LOCAL_STORAGE.removeItem(buildItemKey(collection, ref));
  }

  LOCAL_STORAGE.removeItem(buildIndexKey(collection));
}

/**
 * Loads in the full dataset for the given collection from the local storage cache
 * @param collection The collection to load from the local storage cache
 * @returns A struct of cache items by their refs
 */
export function loadCacheLocalStorage<T>(collection: string): Record<string, CacheItem<T>> {
  const refs = getIndexRefs(collection);

  const data: Record<string, CacheItem<T>> = {};

  for (const ref of refs) {
    if (typeof ref !== "string") { continue; } // Error handling in case someone modifies their local storage

    const rawItem = LOCAL_STORAGE.getItem(buildItemKey(collection, ref));
    if (typeof rawItem !== "string") { continue; }
    
    const item = JSON.parse(rawItem);
    if (typeof item !== "object" || !("doc" in item)) { continue; } // TODO - maybe make a more comprehensive CacheItem check?
    data[ref] = item;
  }

  return data;
}

/**
 * Saves the data manager cache to local storage
 * @param collection The collection being saved to the cache
 * @param data All of the data that may be changed or updated
 * @param updateRefs A list of all refs of updated documents
 * @param deleteRefs A list of all refs that were removed
 */
export function saveCacheLocalStorage(collection: string, data: Record<string, CacheItem<unknown>>, updateRefs: string[], deleteRefs: string[]): void {
  for (const deleteRef of deleteRefs) {
    LOCAL_STORAGE.removeItem(buildItemKey(collection, deleteRef));
  }

  for (const updateRef of updateRefs) {
    LOCAL_STORAGE.setItem(buildItemKey(collection, updateRef), JSON.stringify(data[updateRef]));
  }

  const dataRefs = Object.keys(data);
  LOCAL_STORAGE.setItem(buildIndexKey(collection), JSON.stringify(dataRefs));
}

/**
 * Builds a key for the location that the index will be stored at in local storage
 * @param collection The collection that the index key is for
 * @returns The key to for the index in local storage
 */
function buildIndexKey(collection: string) {
  return `${collection}_ids`
}

/**
 * Creats a key for the location of a document in local storage
 * @param collection The collection that the refs are being saved for
 * @param ref The ref of the document being saved
 * @returns A key to the document location in local storage
 */
function buildItemKey(collection: string, ref: string) {
  return `${collection}_${ref}`;
}

function getIndexRefs(collection: string): string[] {
  const indexKey = buildIndexKey(collection);

  // Load in the list of all document refs stored in the cache
  const indexRaw = LOCAL_STORAGE.getItem(indexKey);
  if (typeof indexRaw !== "string") { return []; } // Handles undefined/null cases

  const index = JSON.parse(indexRaw);
  if (!Array.isArray(index)) { return []; }

  return index;
}