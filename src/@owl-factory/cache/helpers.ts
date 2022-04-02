import { CacheItem, CacheOptions } from "./types";

/**
 * Converts given arguments into a string
 * @param args The arguments to convert into a string
 * @returns A string version of the arguments
 */
export function argsToString(args: any) {
  return JSON.stringify(args);
}

/**
 * Creates a standard cache item
 * @param value The value to store within the cache item
 * @param options Additional options to alter the values of the cache item
 * @returns A cache item
 */
export function buildCacheItem(value: any, options: CacheOptions) {
  const now = Date.now();
  const cacheItem: CacheItem = {
    value,
    ttl: options.ttl,
    updatedAt: now,
    deleteAt: now + (options.ttl * 60 * 1000),
  };
  return cacheItem;
}
