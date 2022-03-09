import { Ref64 } from "@owl-factory/types";
import { isClient } from "@owl-factory/utilities/client";
import { Packet } from "@owl-factory/cache/types";

// Mocks up the window.localStorage to prevent breaks serverside
const mockLocalStorage = {
  clear: () => { return; },
  getItem: (_key: string) => { return undefined; },
  removeItem: (_key: string) => { return; },
  setItem: (_key: string, _value: any) => { return; },
};

export const LOCAL_STORAGE = isClient ? window.localStorage : mockLocalStorage;

/**
 * Loads in all documents from the cache
 * @param key The document type key
 * @returns An array of cache items stored in the cache
 */
export function load<T>(key: string): Packet<T>[]  {
  const docs: Packet<T>[] = [];

  const refs = getRefList(key);
  refs.forEach((ref: Ref64) => {
    const doc = $get(key, ref);
    if (!doc) { return; }
    docs.push(doc);
  });

  return docs;
}

/**
 * Removes one or more documents from the cache
 * @param key The document type key
 * @param targetRefs The refs for documents to delete
 * @returns An array of all deleted documents
 */
export function remove<T>(key: string, targetRefs: Ref64[]): Packet<T>[] {
  const deletedDocs: Packet<T>[] = [];

  const refs = getRefList(key);
  targetRefs.forEach((ref: Ref64) => {
    const doc: Packet<T> | undefined = removeItem(key, ref);
    if (!doc) { return; }
    deletedDocs.push(doc);

    const index = refs.indexOf(doc.ref);
    if (index) { refs.splice(index, 1); }
  });

  setRefList(key, refs);

  return deletedDocs;
}

/**
 * Saves a subset of documents to the cache
 * @param key The document type key
 * @param docs A subset of documents to save to the cache
 * @returns The number of documents save to the cache
 */
export function save<T>(key: string, docs: Packet<T>[]): number {
  let count = 0;

  const refs = getRefList(key);

  docs.forEach((doc: any) => {
    if (!("ref" in doc)) { return; }
    LOCAL_STORAGE.setItem(itemKey(key, doc.ref), JSON.stringify(doc));
    if (!refs.includes(doc.ref)) { refs.push(doc.ref); }
    count++;
  });

  refs.sort();
  setRefList(key, refs);

  return count;
}

/**
 * Looks up a value in the local storage. Returns the found value in a stringified format if found. Undefined if not
 * @param key The key to look up in local storage
 * @returns The stored value in a stringified format
 */
export function get(key: string): string | null | undefined {
  const storedValue = LOCAL_STORAGE.getItem(key);
  return storedValue;
}

/**
 * Converts a value into a JSON string and stored at a location in Local Storage
 * @param key The key to store a value at in local storage
 * @param value The value to convert into a string and store in local storage
 */
export function set(key: string, value: unknown): void {
  const stringifiedValue = JSON.stringify(value);
  LOCAL_STORAGE.setItem(key, stringifiedValue);
}


/**
 * Gets a single document from the cache
 * @param key The document type key
 * @param ref The ref64 of the document to fetch
 * @returns A CacheItem document
 */
function $get(key: string, ref: Ref64) {
  const storedDoc = LOCAL_STORAGE.getItem(itemKey(key, ref));
  if (!storedDoc) { return undefined; }
  const doc = JSON.parse(storedDoc);
  return doc;
}

/**
 * Removes a single item from the cache
 * @param key The document type key
 * @param ref The ref64 of the document to fetch
 * @returns The deleted CacheItem document, if found. Undefined if the document did not exist
 */
function removeItem<T>(key: string, ref: Ref64): Packet<T> | undefined {
  const doc = $get(key, ref);
  if (!doc) { return undefined; }
  LOCAL_STORAGE.removeItem(itemKey(key, ref));
  return doc;
}

/**
 * Fetches the list of references in the cache
 * @param key The document type key
 * @returns An array of all ref64s with documents currently stored
 */
function getRefList(key: string): string[] {
  // Grabs a list of all of the stored IDs
  const storedIDs = LOCAL_STORAGE.getItem(idListKey(key));
  if (!storedIDs) { return []; }

  // Loop through and load each ID from local storage
  const refs = JSON.parse(storedIDs);
  return refs;
}

/**
 * Sets a list of references in the cache to track which ones are stored
 * @param key The document type key
 * @param refs The new list of refs to save to the database
 */
function setRefList(key: string, refs: Ref64[]) {
  const list = JSON.stringify(refs);
  LOCAL_STORAGE.setItem(idListKey(key), list);
}

/**
 * Returns the key used for storing the list of all refs for the given document key
 * @param key The document type key
 * @returns The key for accessing the ref list
 */
function idListKey(key: string) {
  return `${key}_ids`;
}

/**
 * Builds a key for storing a document
 * @param key The document type key
 * @param ref The document reference
 * @returns A key for the location a document will be stored
 */
function itemKey(key: string, ref: Ref64) {
  return `${key}_${ref}`;
}
