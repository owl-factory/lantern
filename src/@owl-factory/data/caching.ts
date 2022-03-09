import { LOCAL_STORAGE } from "@owl-factory/cache/storage/localStorage";
import { Packet } from "@owl-factory/cache/types";
import { Ref64 } from "@owl-factory/types";

/**
 * Clears the local storage
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

export function setRefs(collection: string, refs: Ref64[]) {
  const indexKey = buildIndexKey(collection);
  LOCAL_STORAGE.setItem(indexKey, JSON.stringify(refs));
}

function buildIndexKey(collection: string) {
  return `${collection}_ids`;
}

function buildPacketKey(collection: string, ref: Ref64): string {
  return `${collection}_${ref}`;
}