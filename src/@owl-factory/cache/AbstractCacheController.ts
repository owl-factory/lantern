/**
 * GOAL: to manage a cache of data to limit the number of calls to the database that are required
 * and improve load times by caching data locally. This should also be usable on the backend to temporarily
 * persist data between different calls
 *
 * This base controller should not contain any business logic and should be reorganized to the @owl-factory directory
 */

import { Ref64 } from "types";
import { isClient } from "utilities/tools";
import { load, save } from "@owl-factory/cache/storage/localStorage";
import { CacheItem, CacheItemMetadata } from "@owl-factory/cache/types";
import { rest } from "utilities/request";
import { Errors, isError } from "@owl-factory/types/errors";
import { action, makeObservable } from "mobx";

// A set of different levels for when the cache should passively refresh a document
enum PassiveReadLevel {
  Never,
  IfUnloaded,
  IfStale,
  Force
}

interface RefRequired {
  ref: Ref64;
}

export abstract class CacheController<T extends RefRequired> {
  public abstract readonly key: string; // The key used for differentiating the data in storage
  public abstract readonly apiURL: string; // The API endpoint for accessing data

  // An object that contains all of the data currently cached
  protected data: Record<string, CacheItem<T>> = {};

  protected staleTime = 1000 * 60 * 30; // The time until a document becomes stale, in milliseconds
  // A flag that informs the cache when a document should be pulled from the database again
  protected passiveReadLevel = PassiveReadLevel.Never;

  protected lastTouched = 0; // The last time that the cache was touched. Used for observables

  constructor() {
    // Runs the cache load only on the client
    if (isClient) {
      document.addEventListener('DOMContentLoaded', () => this.loadCache(), false);
    }

    makeObservable(this, {
      loadCache: action,
    });
  }

  /**
   * Loads documents from the cache into memory
   */
  public loadCache() {
    const docs = load<T>(this.key);
    this.$setMany(docs, false);
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
   * Creates a new document from the database
   * @param doc The document to create from the database
   * @returns The completed document or an error explaining why it failed
   */
  public async create(doc: Partial<T>): Promise<Partial<T> | Errors> {
    const docs = await this.createMany([doc]);
    if (docs.length === 0) { return { errors: ["An unexpected error has occured"]}; }
    return docs[0];
  }

  /**
   * Creates one or more documents from the database
   * @param docs The documents to create from the database
   * @returns An array of documents or errors explaining why they failed
   */
  public async createMany(docs: Partial<T>[]): Promise<(Partial<T> | Errors)[]> {
    const createdDocs = this.$createMany(docs);
    return [];
  }

  protected async $createMany(docs: Partial<T>[]) {
    const result = await rest.put<{docs: Partial<T>[]}>(this.apiURL, { docs: docs });
    if (!result.success) { return []; }
    const createdDocs = result.data.docs;
    this.setMany(createdDocs);
  }

  /**
   * Deletes a single document from the database
   * @param ref The ref of the document to delete from the database
   * @returns The deleted document or an error explaining why it could not be deleted
   */
  protected async delete(ref: Ref64): Promise<Partial<T> | Errors> {
    const docs = await this.deleteMany([ref]);
    if (docs.length === 0) { return { errors: ["An unexpected error has occured"]}; }
    return docs[0];
  }

  /**
   * Deletes one or more documents from the database
   * @param refs The refs of the documents to delete from the database
   * @returns An array of the deleted documents or errors explaining why they could not be deleted
   */
  protected async deleteMany(refs: Ref64[]): Promise<(Partial<T> | Errors)[]> {
    return [];
  }

  /**
   * Reads a single document from the database
   * @param ref The ref of the document to read
   * @returns The document or an error explaining why the document could not be read
   */
  protected async read(ref: Ref64): Promise<Partial<T> | Errors> {
    const docs = await this.readMany([ref]);
    if (docs.length === 0) { return { errors: ["An unexpected error has occured"]}; }
    return docs[0];
  }

  /**
   * Reads one or more documents from the database
   * @param refs The refs of the documents to read from the database
   * @returns The documents or errors explaining why the document could not be read
   */
  protected async readMany(refs: Ref64[]): Promise<Partial<T>[]> {
    return [];
  }

  /**
   * Reads any documents in the given list of refs if they are not in the cache
   * @param refs The refs of the documents to read if they are not present in the cache
   * @param readLevel Determines at which point the documents should be fetched from the database
   * @returns An array of documents or errors explaining why they could not be read
   */
  protected async readMissing(
    refs: Ref64[], 
    readLevel: PassiveReadLevel = this.passiveReadLevel
  ): Promise<(Partial<T> | Error)[]> {
    return [];
  }

  /**
   * Updates a single document in the database
   * @param ref The ref of the document to update
   * @param doc The changed fields in the document to update
   * @returns The updated document or an error explaining why it could not be updated
   */
  protected async update(ref: Ref64, doc: Partial<T>): Promise<Partial<T> | Errors> {
    const docs = await this.updateMany([{ ref, doc }]);
    if (docs.length === 0) { return { errors: ["An unexpected error has occured"]}; }
    return docs[0];
  }

  /**
   * Updates one or many documents in the database
   * @param docs An array of document packages with a ref and changed fields instructing what documents to update
   * @returns An array of updated documents or errors explaining why they could not be updated
   */
  protected async updateMany(docs: { ref: Ref64, doc: Partial<T> }[]): Promise<(Partial<T> | Errors)[]> {
    return [];
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
      if (!("ref" in doc) || !doc.ref) { return; }
      const cacheItem: CacheItem<T> = {
        ref: doc.ref,
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

  protected $toCacheItem(docs: Partial<T>[], meta?: CacheItemMetadata): CacheItem<T>[] {
    const cacheItems: CacheItem<T>[] = [];

    const metadata = meta !== undefined ? { ...meta } : {
      isLoaded: false,
      loadedAt: 0,
      updatedAt: 0,
    };
    metadata.updatedAt = Date.now();

    docs.forEach((doc: Partial<T>) => {
      if (!doc.ref) { return; }
      const cacheItem: CacheItem<T> = {
        ref: doc.ref,
        doc: doc,
        meta: metadata,
      };
      cacheItems.push(cacheItem);
    });

    return cacheItems;
  }

  /**
   * Saves the given items and their metadata into the cache. This is the internal method
   * @param cacheItems The items to place or update in the cache, in the standard cache format
   */
  protected $setMany(cacheItems: CacheItem<T>[], saveList = true): void {
    if (cacheItems === undefined || cacheItems.length === 0) { return; }

    cacheItems.forEach((cacheItem: CacheItem<T>) => {
      if (!cacheItem || !cacheItem.doc || !("ref" in cacheItem.doc)) { return; }

      const ref = cacheItem.doc.ref as string;
      this.data[ref] = cacheItem;
    });

    // Saves this list to the cache
    if (saveList) { save<CacheItem<T>>(this.key, cacheItems); }
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
        ref: doc.ref,
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

  /**
   * Updates the last touched time
   */
  protected touch() {
    this.lastTouched = Date.now();
  }

  /**
   * 
   * @param refs A list of refs to fetch
   * @returns 
   */
  protected async $readManyAPI(refs: string[]): Promise<Partial<T>[]> {
    if (refs.length === 0) { return []; }
    const result = await rest.post<{ docs: T[] }>(this.apiURL, { refs: refs });
    if (!result.success) { return []; }
    this.setMany(result.data.docs);
    return result.data.docs;
  }

  // protected async $createOneAPI
}

function merge<T>(obj1: Partial<T>, obj2: Partial<T>): Partial<T> {
  return obj2;
}
