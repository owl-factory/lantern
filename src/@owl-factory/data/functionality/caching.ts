/**
 * Handles the caching of data to given source such that calls to the database or an API are minimized
 */

import { CacheItem } from "@owl-factory/cache/types";
import { DataManager } from "../AbstractDataManager";
import { clearCacheLocalStorage, loadCacheLocalStorage, saveCacheLocalStorage } from "../caching/local-storage";
import { CacheMethod } from "../enums";

type GenericRecord = Record<string, unknown>;

export function initializeCacheBatchJob<T extends GenericRecord>(this: DataManager<T>) {
  this.$cacheBatchJob = setInterval(this.$saveCache, this.$cacheSaveInterval);
}

/**
 * Loads in the data for this data manager from the cache
 */
export function loadCache<T extends GenericRecord>(this: DataManager<T>) {
  let data: Record<string, CacheItem<T>>;
  switch (this.cacheMethod) {
    case CacheMethod.LocalStorage:
      data = loadCacheLocalStorage<T>(this.collection);
      break;

    default:
      return;
  }

  this.$data = data;
}

/**
 * Queues a document ID to be queued for caching
 * @param ref The ID of the document to queue for the next cache run
 */
export function markUpdated(this: DataManager<GenericRecord>, ref: string) {
  this.$cacheQueue[ref] = 1;
}

/**
 * Compiles the updated and deleted keys, then runs the specified method to save the cache
 */
export function saveCache<T extends GenericRecord>(this: DataManager<T>): void {
  const refs: string[] = Object.keys(this.$cacheQueue);
  const updateKeys: string[] = [];
  const deleteKeys: string[] = [];

  // Skip out before doing any more work
  if (refs.length === 0) { return; }

  for (const ref of refs) {
    // Mark this for deletion
    if (!(ref in this.$data)) {
      deleteKeys.push(ref);
      continue;
    }

    updateKeys.push(ref);
  }

  switch (this.cacheMethod) {
    case CacheMethod.LocalStorage:
      saveCacheLocalStorage(this.collection, this.$data, updateKeys, deleteKeys);
      break;
  }
}

export function clearCache<T extends GenericRecord>(this: DataManager<T>): void {
  switch (this.cacheMethod) {
    case CacheMethod.LocalStorage:
      clearCacheLocalStorage(this.collection);
      break;
  }
}