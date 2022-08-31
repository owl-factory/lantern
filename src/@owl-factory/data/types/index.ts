import { Ref64 } from "@owl-factory/types";


// The standard package of data stored within the cache
export interface Packet<T> {
  ref: Ref64;
  doc: T; // The document data for business logic
  meta: PacketMetadata;
}

// The metadata for a cache item
export interface PacketMetadata {
  loaded: boolean; // If the full item was loaded in from the database, or partially
  loadedAt: number; // The last time that this item was loaded in from the database
  updatedAt: number; // The last time that this item was updated
}

/**
 * An interface for describing what a user is searching for
 */
export interface SearchParams {
  page?: number; // The page of data to pull
  perPage?: number; // The number of documents per page
  sort?: string[]; // The order of fields and the direction that they should be sorted
  filters?: Record<string, string>; // The fields to filter
  group?: string; // The group of data to search through. 
  // The total number of documents to skip before starting to search. 
  // Used in place of page and per page up to the point where the skip ends
  skip?: number;
}
