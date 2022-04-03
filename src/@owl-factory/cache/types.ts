export interface CacheOptions {
  ttl: number; // Time in seconds that the cache item should live
}
// FunctionName { ArgumentString { CacheItem } }
export type Cache = Record<string, Record<string, CacheItem>>;
export interface CacheItem {
  value: any;
  updatedAt: number;
  ttl: number;
  deleteAt: number;
  prune: any;
}
