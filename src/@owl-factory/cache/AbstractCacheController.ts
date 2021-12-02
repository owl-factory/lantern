/**
 * GOAL: to manage a cache of data to limit the number of calls to the database that are required
 * and improve load times by caching data locally. This should also be usable on the backend to temporarily
 * persist data between different calls
 *
 * This base controller should not contain any business logic and should be reorganized to the @owl-factory directory
 */

import { Ref64 } from "types";
import { isClient } from "utilities/tools";

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

interface CacheData<T> {
  data: T;
  $meta: Metadata;
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

  public readMany: (refs: Ref64[]) => Promise<T[]> = async (_) => [];
  public create: (doc: Partial<T>) => (Promise<T | undefined>) = async (_) => (undefined);
  public deleteMany: (refs: Ref64[]) => Promise<T[]> = async (_) => [];
  public update: (ref: Ref64, doc: Partial<T>) => (Promise<T | undefined>) = async (_1, _2) => (undefined);

  protected data: Record<string, Partial<T>> = {};
  protected metadata: Record<string, Metadata> = {};

  protected staleTime = 1000 * 60 * 30;
  protected passiveReadLevel = PassiveReadLevel.Never;

  protected lastTouched = 0;

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
      const item = await this.$read(ref);
      return item;
    }

    let item: Partial<T> | undefined = this.data[ref];
    const meta = this.getMeta(ref);

    switch(readLevel) {
      case PassiveReadLevel.Never:
        return item;

      case PassiveReadLevel.IfUnloaded:
        item = await this.$readIfUnloaded(item, meta);
        return item;

      case PassiveReadLevel.IfStale:
        item = await this.$readIfStale(item, meta, staleTime);
        item = await this.$readIfUnloaded(item, meta);
        return item;

      case PassiveReadLevel.Force:
        item = await this.$read(ref);
        return item;
    }
  }

  /**
   * Reads the updated version of an item from the database if it is stale, otherwise returns the existing item
   * @param item The currently existing item, if any
   * @param meta The metadata for the current item
   * @param staleTime The maximum time allowed since the last load
   * @returns The item
   */
  protected async $readIfStale(
    item: Partial<T> | undefined,
    meta: Metadata,
    staleTime: number
  ): Promise<Partial<T> | undefined> {
    // If it's not loaded right now, then we'll assume that there's an issue elsewhere
    if (item === undefined || meta === undefined) { return item; }
    if (!("ref" in item)) { return item; }
    if (meta.loadedAt > Date.now() - staleTime) { return item; }
    item = await this.$read(item.ref as string);
    return item;
  }

  /**
   * Reads the full version of an item from the database if it is unloaded, otherwise returns the existing item
   * @param item The currently existing item, if any
   * @param meta The metadata for the current item
   * @returns The item
   */
  protected async $readIfUnloaded(
    item: Partial<T> | undefined,
    meta: Metadata | undefined
  ): Promise<Partial<T> | undefined> {
    if (item === undefined || meta === undefined) { return item; }
    if (!("ref" in item)) { return item; }
    if (meta.isLoaded) { return item; }
    item = await this.$read(item.ref as string);
    return item;
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
    const metas: Partial<Metadata>[] = [];
    docs.forEach((doc: Partial<T>) => {
      const meta = { updatedAt: Date.now(), loadedAt: 0, isLoaded: false };
      metas.push(meta);
    });
    this.$setMany(docs, metas);
  }

  protected $setMany(docs: Partial<T>[], metas: Partial<Metadata>[]) {
    if (docs === undefined) { return; }
    docs.forEach((doc: (Partial<T>), index: number) => {
      if (doc === undefined || !("ref" in doc)) { return; }
      const meta = metas[index];

      const ref = doc.ref as string;
      this.data[ref] = doc;
      this.metadata[ref] = merge<Metadata>(this.metadata[ref], meta);

      // Sets the document in the local storage
      LOCAL_STORAGE.setItem(this.buildKey(ref), JSON.stringify(doc));
    });
    this.updateStorageKeys();
    this.touch();
  }

  /**
   * Reads one document from the database
   * @param ref The ID of the document to read
   */
  protected async $read(ref: Ref64): Promise<T | undefined> {
    const docs = await this.$readMany([ref]);
    if (docs.length === 0) { return undefined; }
    return docs[0];
  }

  /**
   * Reads many documents from the database
   * @param refs The refs of the documents to read
   * @returns An unsorted array of all of the found documents
   */
   protected async $readMany(refs: string[]) {
    if (refs.length === 0) { return []; }
    const docs = await this.readMany(refs);

    return docs;
  }

  protected touch() {
    this.lastTouched = Date.now();
  }

  protected buildKey(ref: string) {
    return `${this.key}_${ref}`;
  }

  protected getMeta(ref: Ref64): Metadata {
    if ((ref in this.metadata)) { return this.metadata[ref]; }
    const meta = this.newMeta(ref, 0, false);
    return meta;
  }

  protected newMeta(ref: Ref64, loadedAt: number, isLoaded: boolean) {
    const meta: Metadata = { loadedAt: loadedAt, isLoaded: isLoaded };
    this.metadata[ref] = meta;
    return meta;
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