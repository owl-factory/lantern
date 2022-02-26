import { CacheItem, CacheItemMetadata } from "@owl-factory/data/types";
import { deepMerge } from "@owl-factory/utilities/objects";

/**
 * Builds a cache item
 * @param ref The reference of the document
 * @param doc The document to put into the cache item
 * @param meta The metadata for the cache item
 * @returns The completed cache item
 */
export function buildCacheItem(
  ref: string,
  doc: Record<string, unknown>,
  meta: CacheItemMetadata
): CacheItem<Record<string, unknown>> {
  return {
    ref,
    doc,
    meta,
  };
}

/**
 * Builds a complete metadata object
 * @param loaded Whether or not the document is loaded in
 * @param updatedAt The last time that the document was updated according to the server
 * @returns A complete metadata object
 */
export function buildMeta(loaded: boolean, updatedAt = 0): CacheItemMetadata {
  const meta = {
    loaded: loaded,
    loadedAt: loaded ? Date.now() : 0,
    updatedAt: updatedAt,
  };
  return meta;
}

/**
 * Merges an old cache item with a new one
 * @param newItem The newer item
 * @param existingItem The older item
 * @returns The merged cache item
 */
 export function mergeCacheItems(
  newItem: CacheItem<Record<string, unknown>>,
  existingItem: CacheItem<Record<string, unknown>>
): CacheItem<Record<string, unknown>> {
  // Ensures that the given item is set, but marks it as unloaded so that the next load will get the most updated value
  if (newItem.meta.updatedAt < existingItem.meta.updatedAt) {
    newItem.meta.loaded = false;
    newItem.meta.loadedAt = 0;
    return newItem;
  }

  const mergedItem: CacheItem<Record<string, unknown>> = {
    ref: newItem.ref,
    doc: deepMerge(newItem.doc, existingItem.doc),
    meta: {
      loaded: newItem.meta.loaded || existingItem.meta.loaded,
      loadedAt: newItem.meta.loadedAt > existingItem.meta.loadedAt ? newItem.meta.loadedAt : existingItem.meta.loadedAt,
      updatedAt: newItem.meta.updatedAt,
    },
  };

  return mergedItem;
}
