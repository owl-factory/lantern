import { LOCAL_STORAGE } from "@owl-factory/storage/localStorage";
import { Packet } from "@owl-factory/data/types";
import { Ref64 } from "@owl-factory/types";

/**
 * Clears the local storage of a specific collection
 * Not guaranteed to get everything, as it can only delete the keys it knows of
 */
export function clear(collection: string): void {
  const refs = getRefs(collection);
  for (const ref in refs) {
    remove(collection, ref);
  }
  setRefs(collection, []);
}

/**
 * Removes a single document from the local storage
 * @param collection The collection to remove the document from
 * @param ref The ref of the document to remove
 * @returns The number of documents deleted
 */
export function remove(collection: string, ref: Ref64): number {
  const key = buildPacketKey(collection, ref);

  // Reading and checking for existing might be faster than just trying to remove if not present
  // Need to double check this though
  const item = LOCAL_STORAGE.getItem(key);
  if (!item) { return 0; }

  LOCAL_STORAGE.removeItem(key);
  return 1;
}

export function set(collection: string, packet: Packet<unknown>) {
  const key = buildPacketKey(collection, packet.ref);
  LOCAL_STORAGE.setItem(key, JSON.stringify(packet));
}

/**
 * Gets the list of refs stored for a single collection
 * @param collection The collection to get the stored refs from
 * @returns An array containing a list of refs
 */
function getRefs(collection: string): Ref64[] {
  const indexKey = buildIndexKey(collection);
  const rawRefs = LOCAL_STORAGE.getItem(indexKey);
  if (rawRefs === null || rawRefs === undefined) { return []; }
  try {
    const refs = JSON.parse(rawRefs);
    return refs;
  } catch (e) {
    // TODO - have extra handling for removing old refs. Maybe try to rebuild?
    console.error(`Error reading the cached refs for the ${collection} collection.`);
    return [];
  }
}

/**
 * Stores a list of refs to the cache to index which documents are being stored for this collection
 * @param collection The collection the refs belong to
 * @param refs The list of refs being stored to the cache
 */
export function setRefs(collection: string, refs: Ref64[]) {
  const indexKey = buildIndexKey(collection);
  LOCAL_STORAGE.setItem(indexKey, JSON.stringify(refs));
}

/**
 * Generates a standard index key for a given collection
 * @param collection The collection the index key is for
 * @returns A string containing a standard index key for this collection
 */
function buildIndexKey(collection: string) {
  return `${collection}_ids`;
}

/**
 * Generates a key for storing a packet to the cache
 * @param collection The collection this ref belongs to
 * @param ref The ref of the document being stored or fetched from the cache
 * @returns A standard key unique to the collection and ref being stored
 */
function buildPacketKey(collection: string, ref: Ref64): string {
  return `${collection}_${ref}`;
}
