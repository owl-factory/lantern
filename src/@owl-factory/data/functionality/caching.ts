/**
 * Handles the caching of data to given source such that calls to the database or an API are minimized
 */

import { CacheItem } from "../types";
import { DataManager } from "../DataManager";
import { clearCacheLocalStorage, loadCacheLocalStorage, saveCacheLocalStorage } from "../caching/local-storage";
import { CacheMethod } from "../enums";
import { Ref64 } from "@owl-factory/types";

type GenericRecord = Record<string, unknown>;


// /**
//  * Clears out the cache
//  */
// export function clearCache<T extends GenericRecord>(this: DataManager<T>): void {
//   switch (this.cacheMethod) {
//     case CacheMethod.LocalStorage:
//       clearCacheLocalStorage(this.collection);
//       break;
//   }
// }

// /**
//  * Initializes the caching batch job
//  */
// export function initializeCacheBatchJob<T extends GenericRecord>(this: DataManager<T>) {
//   // this.$cacheBatchJob = setInterval(() => this.$saveCache(), this.$cacheSaveInterval);
// }

// /**
//  * Loads in the data for this data manager from the cache
//  */
// export function loadCache<T extends GenericRecord>(this: DataManager<T>) {
//   let data: Record<string, CacheItem<T>>;
//   switch (this.cacheMethod) {
//     case CacheMethod.LocalStorage:
//       data = loadCacheLocalStorage<T>(this.collection);
//       break;

//     default:
//       return;
//   }

//   const cachedRefs = Object.keys(data);
//   // TODO - use a piece of setOne
//   for (const ref of cachedRefs) {
//     // TODO
//   }
//   this.touch();
// }

// /**
//  * Queues a document ID to be queued for caching
//  * @param ref The ID of the document to queue for the next cache run
//  */
// export function markUpdated<T extends GenericRecord>(this: DataManager<T>, ref: string) {
//   this.$cacheQueue[ref] = 1;
// }

// /**
//  * Compiles the updated and deleted keys, then runs the specified method to save the cache
//  */
// export function saveCache<T extends GenericRecord>(this: DataManager<T>, refs: Ref64[]): void {
//   const updateKeys: string[] = [];
//   const deleteKeys: string[] = [];

//   // Skip out before doing any more work
//   if (!refs || refs.length === 0) { return; }

//   for (const ref of refs) {
//     // Mark this for deletion
//     if (!(ref in this.$data)) {
//       deleteKeys.push(ref);
//       continue;
//     }

//     updateKeys.push(ref);
//   }

//   switch (this.cacheMethod) {
//     case CacheMethod.LocalStorage:
//       saveCacheLocalStorage(this.collection, this.$data, updateKeys, deleteKeys);
//       break;
//   }
// }

// export function addToCacheQueue<T extends GenericRecord>(this: DataManager<T>, ref: Ref64): void {
//   return
// }

// export function runCacheQueue<T extends GenericRecord>(this: DataManager<T>) {
//   return
// }
