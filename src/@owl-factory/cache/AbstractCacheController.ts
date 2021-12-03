/**
 * GOAL: to manage a cache of data to limit the number of calls to the database that are required
 * and improve load times by caching data locally. This should also be usable on the backend to temporarily
 * persist data between different calls
 *
 * This base controller should not contain any business logic and should be reorganized to the @owl-factory directory
 */

import { Ref64 } from "types";
import { isClient } from "utilities/tools";

// A set of different levels for when the cache should passively refresh a document
enum PassiveReadLevel {
  Never,
  IfUnloaded,
  IfStale,
  Force
}

interface Metadata {
  isLoaded: boolean; // If the full item was loaded in from the database, or partially
  loadedAt: number; // The last time that this item was loaded in from the database
  updatedAt: number; // The last time that this item was updated
}

// The standard package of data stored within the cache
interface CacheItem<T> {
  doc: Partial<T>; // The document data for business logic
  meta: Metadata; // Metadata about the document
}

interface RefRequired {
  ref: Ref64;
}

const mockLocalStorage = {
  clear: () => { return; },
  getItem: (_key: string) => { return undefined; },
  removeItem: (_key: string) => { return; },
  setItem: (_key: string, _value: any) => { return; },
};

const LOCAL_STORAGE = isClient ? window.localStorage : mockLocalStorage;

export abstract class CacheController<T extends RefRequired> {
  public readonly key: string; // The key used for differentiating the data in storage

  // A settable function for reading one document
  public read: (ref: Ref64) => Promise<T | undefined> = async (ref) => ((await this.readMany([ref]))[0]);
  // A settable function for reading many documents at once
  public readMany: (refs: Ref64[]) => Promise<T[]> = async (_) => [];
  // A settable function for creating a single document
  public create: (doc: Partial<T>) => (Promise<T | undefined>) = async (_) => (undefined);
  // A settable function for deleting a single document
  public delete: (ref: Ref64) => Promise<T | undefined> = async (ref) => ((await this.deleteMany([ref]))[0]);
  // A settable function for deleting many documents
  public deleteMany: (refs: Ref64[]) => Promise<T[]> = async (_) => [];
  // A settable function for updating a single document
  public update: (ref: Ref64, doc: Partial<T>) => (Promise<T | undefined>) = async (_1, _2) => (undefined);

  // An object that contains all of the data currently cached
  protected data: Record<string, CacheItem<T>> = {};

  protected staleTime = 1000 * 60 * 30; // The time until a document becomes stale, in milliseconds
  // A flag that informs the cache when a document should be pulled from the database again
  protected passiveReadLevel = PassiveReadLevel.Never;

  protected lastTouched = 0; // The last time that the cache was touched. Used for observables

  constructor(key: string) {
    this.key = key;
  }

  /**
   * Fetches a single item from the database
   * @param ref The ref of the item
   * @param readLevel The Passive Read Level rule for when to fetch the object from the database
   * @param staleTime The amount of time in milliseconds that the cache should wait before attempting to fetch
   *  fresh data (ReadLevel.IfStale only)
   * @returns The item, either a partial or a full document
   */
  public async get(
    ref: Ref64,
    readLevel: PassiveReadLevel = this.passiveReadLevel,
    staleTime: number = this.staleTime
  ): Promise<Partial<T> | undefined> {
    // Fetches the ref if it's not present in the cache
    if (!(ref in this.data)) {
      const cacheItem: CacheItem<T> | undefined = await this.$read(ref);
      return cacheItem?.doc;
    }

    let cacheItem: CacheItem<T> | undefined = this.data[ref];
    const meta = cacheItem.meta;

    switch(readLevel) {
      case PassiveReadLevel.Never:
        return cacheItem.doc;

      case PassiveReadLevel.IfUnloaded:
        cacheItem = await this.$readIfUnloaded(cacheItem);
        return cacheItem?.doc;

      case PassiveReadLevel.IfStale:
        cacheItem = await this.$readIfStale(cacheItem, staleTime);
        cacheItem = await this.$readIfUnloaded(cacheItem);
        return cacheItem?.doc;

      case PassiveReadLevel.Force:
        cacheItem = await this.$read(ref);
        return cacheItem?.doc;
    }
  }

  /**
   * Reads the updated version of an item from the database if it is stale, otherwise returns the existing item
   * @param item The currently existing item, if any
   * @param meta The metadata for the current item
   * @param staleTime The maximum time allowed since the last load
   * @returns The item
   */
  protected async $readIfStale(cacheItem: CacheItem<T>, staleTime: number): Promise<CacheItem<T> | undefined> {
    // If it's not loaded right now, then we'll assume that there's an issue elsewhere
    if (!cacheItem || !cacheItem.doc || cacheItem.doc.ref) { return cacheItem; }

    if (cacheItem.meta.loadedAt > Date.now() - staleTime) { return cacheItem; }
    const newCacheItem = await this.$read(cacheItem.doc.ref as string);
    return newCacheItem;
  }

  /**
   * Reads the full version of an item from the database if it is unloaded, otherwise returns the existing item
   * @param item The currently existing item, if any
   * @param meta The metadata for the current item
   * @returns The item
   */
  protected async $readIfUnloaded(cacheItem?: CacheItem<T>): Promise<CacheItem<T> | undefined> {
    // Base case: undefined item
    if (!cacheItem) { return cacheItem; }
    // Base case: return if no ref is present (somehow)
    if (!cacheItem.doc || !("ref" in cacheItem.doc)) { return cacheItem; }
    if (cacheItem.meta.isLoaded) { return cacheItem; }
    const newCacheItem = await this.$read(cacheItem.doc.ref as string);
    return newCacheItem;
  }

  /**
   * Sets a document in the data manager. Updates both the data manager and the instance in local storage
   * @param doc The document to add or update in the data manager
   */
   public set(doc: Partial<T>): void {
    this.setMany([doc]);
  }

  /**
   * Sets many documents in the data manager and the storage method
   * @param docs The documents to set in the data manager and the storage method
   */
  public setMany(docs: Partial<T>[]): void {
    const cacheItems: CacheItem<T>[] = [];

    // Converts the given doc into the proper cache format
    docs.forEach((doc: Partial<T>) => {
      const cacheItem: CacheItem<T> = {
        doc: doc,
        meta: {
          isLoaded: false,
          loadedAt: 0,
          updatedAt: Date.now(),
        },
      };

      cacheItems.push(cacheItem);
    });

    this.$setMany(cacheItems);
  }

  /**
   * Saves the given items and their metadata into the cache. This is the internal method
   * @param cacheItems The items to place or update in the cache, in the standard cache format
   */
  protected $setMany(cacheItems: CacheItem<T>[]): void {
    if (cacheItems === undefined || cacheItems.length === 0) { return; }

    cacheItems.forEach((cacheItem: CacheItem<T>) => {
      if (!cacheItem || !cacheItem.doc || !("ref" in cacheItem.doc)) { return; }

      const ref = cacheItem.doc.ref as string;
      this.data[ref] = cacheItem;

      // Sets the document in the local storage
      LOCAL_STORAGE.setItem(this.buildKey(ref), JSON.stringify(cacheItem));
    });
    this.updateStorageKeys();
    this.touch();
  }

  /**
   * Reads one document from the database
   * @param ref The ID of the document to read
   */
  protected async $read(ref: Ref64): Promise<CacheItem<T> | undefined> {
    const docs = await this.$readMany([ref]);
    if (docs.length === 0) { return undefined; }
    return docs[0];
  }

  /**
   * Reads many documents from the database
   * @param refs The refs of the documents to read
   * @returns An unsorted array of all of the found documents
   */
   protected async $readMany(refs: string[]): Promise<CacheItem<T>[]> {
    // Base case: skip any logic if no refs are present
    if (refs.length === 0) { return []; }

    const docs = await this.readMany(refs);
    const cacheItems: CacheItem<T>[] = [];

    docs.forEach((doc: Partial<T>) => {
      // Skip if the doc is undefined or no ref is present
      if (!doc || !doc.ref) { return; }
      const cacheItem: CacheItem<T> = {
        doc: doc,
        meta: {
          isLoaded: true,
          loadedAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      cacheItems.push(cacheItem);
    });

    this.$setMany(cacheItems);

    return cacheItems;
  }

  protected touch() {
    this.lastTouched = Date.now();
  }

  protected buildKey(ref: string) {
    return `${this.key}_${ref}`;
  }

  /**
   * Sets the updated list of keys/ids in local storage
   */
  protected updateStorageKeys() {
    LOCAL_STORAGE.setItem(`${this.key}_ids`, JSON.stringify(Object.keys(this.data)));
  }

}

function merge<T>(obj1: Partial<T>, obj2: Partial<T>): Partial<T> {
  return obj2;
}
