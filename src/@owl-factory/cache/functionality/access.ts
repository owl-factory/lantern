import { Ref64 } from "@owl-factory/types";
import { CacheController } from "../AbstractCacheController";
import { PassiveReadLevel } from "../enums";
import { CacheItem, RefRequired } from "../types";

/**
 * Fetches a single item from the database
 * @param ref The ref of the item
 * @param readLevel The Passive Read Level rule for when to fetch the object from the database
 * @param staleTime The amount of time in milliseconds that the cache should wait before attempting to fetch
 *  fresh data (ReadLevel.IfStale only)
 * @returns The item, either a partial or a full document
 */
export async function get<T extends RefRequired>(
  this: CacheController<T>,
  ref: Ref64,
  readLevel: PassiveReadLevel = this.passiveReadLevel,
  staleTime: number = this.staleTime
): Promise<Partial<T> | undefined> {
  // Fetches the ref if it's not present in the cache or if the read is forced
  if (!(ref in this.data) || readLevel === PassiveReadLevel.Force) {
    const doc = await this.read(ref);
    return doc as Partial<T> | undefined;
  }

  let cacheItem: CacheItem<T> | undefined = this.data[ref];
  if (cacheItem === undefined) { return undefined; } // Safety case, though it should never be hit

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
  }
}

/**
 * Sets a document in the data manager. Updates both the data manager and the instance in local storage
 * @param doc The document to add or update in the data manager
 */
export function set<T extends RefRequired>(this: CacheController<T>, doc: Partial<T>): void {
  this.setMany([doc]);
}

/**
 * Sets many documents in the data manager and the storage method
 * @param docs The documents to set in the data manager and the storage method
 */
export function setMany<T extends RefRequired>(this: CacheController<T>, docs: Partial<T>[]): void {
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
