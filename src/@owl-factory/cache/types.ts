import { Ref64 } from "@owl-factory/types";

// Defines a base object that must have a reference element. 
// Used to extend other interfaces (eg <T extends RefRequired>)
export interface RefRequired {
  ref: Ref64;
}

// The standard package of data stored within the cache
export interface CacheItem<T> {
  ref: Ref64;
  doc: Partial<T>; // The document data for business logic
  meta: CacheItemMetadata;
}

// The metadata for a cache item
export interface CacheItemMetadata {
  isLoaded: boolean; // If the full item was loaded in from the database, or partially
  loadedAt: number; // The last time that this item was loaded in from the database
  updatedAt: number; // The last time that this item was updated
}

// Search options for searching through a page from the cache
// WORK IN PROGRESS
export interface GetPageOptions {
  match?: (doc: unknown) => boolean;
  page?: number;
  size?: number;
  sort?: string | string[];
}

