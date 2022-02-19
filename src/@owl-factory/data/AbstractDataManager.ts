import { CacheItem, CacheItemMetadata } from "@owl-factory/cache/types";
import { isClient } from "@owl-factory/utilities/client";
import { deepMerge, fieldInObject, read } from "@owl-factory/utilities/objects";
import { action, makeObservable, observable } from "mobx";
import { CacheMethod, ReloadPolicy } from "./enums";
import * as caching from "./functionality/caching";
import * as data from "./functionality/data";
import * as grouping from "./functionality/grouping";
import { SearchParams } from "./types";



export class DataManager<T extends Record<string, unknown>> {
  protected refField = "ref"; // The field containing a unique ID for the document
  protected updatedAtField = "updatedAt"; // The field containing the document's last updated time
  protected collection = "data"; // The name of the collection of data. Used for logs and caching

  protected cacheMethod = CacheMethod.LocalStorage; // The location that the data will be cached at
  // The policy for determining if a document should be reloaded if already loaded
  protected reloadPolicy = ReloadPolicy.IfStale;

  protected staleTime = 1000 * 60 * 30; // The time until a document becomes stale in milliseconds

  public $data: Record<string, CacheItem<T>> = {}; // The bucket that holds all data loaded into the data manager
  // A collection of lists of refs for data that fits into a specific group
  public $groups: Record<string, string[]> = {};
   // Functions that determine if a document fits into a group
  public $groupValidation: Record<string, (doc: T) => boolean> = {};
  public $indexes: Record<string, unknown> = {}; // UNUSED

  // A set of records that will be updated the next time the cache queue is emptied
  protected $cacheQueue: Record<string, number> = {};
  protected $cacheBatchJob!: NodeJS.Timeout;
  protected $cacheSaveInterval = 1000 * 60 * 5;

  public $lastTouched = 0;

  constructor() {
    if (isClient) {
      window.addEventListener("load", () => {
        this.$loadCache();
        this.$initializeCacheBatchJob();
      });

      makeObservable(this, {
        $loadCache: action,
        $setMany: action,
        touch: action,

        $data: observable,
        $lastTouched: observable,
      });
    }
  }

  public clear = data.clear;
  public get = data.get;
  public getMany = data.getMany;
  public load = data.load;
  public search = data.search;
  public set = data.set;
  public setMany = data.setMany;

  protected $clearCache = caching.clearCache;
  protected $initializeCacheBatchJob = caching.initializeCacheBatchJob;
  public $loadCache = caching.loadCache;
  protected $markUpdated = caching.markUpdated;
  protected $saveCache = caching.saveCache;

  public addGroup = grouping.addGroup;
  public removeGroup = grouping.removeGroup;
  protected $clearGroups = grouping.clearGroups;
  protected $createItemInGroups = grouping.createItemInGroups;
  protected $removeItemFromGroups = grouping.removeItemFromGroups;
  protected $updateItemInGroups = grouping.updateItemInGroups;

  get lastTouched() { return this.$lastTouched; }
  public touch() { this.$lastTouched = Date.now(); }
  

  /**
   * Set many documents into the data manager
   * @protected
   * @param docs The list of documents to set in the data
   * @param loaded True if the document is fully loaded, false otherwise
   * @returns True if one or more documents were set. False if none succeed
   */
  public $setMany(docs: T[], loaded: boolean): boolean {
    let totalSuccess = false;
    const succeededRefs: string[] = [];

    for (const doc of docs) {
      const success = this.$setOne(doc, loaded);
      totalSuccess = totalSuccess || success;

      if (!success) { continue; }
      const ref = this.$getRef(doc);
      succeededRefs.push(ref);
    }

    this.touch();
    return totalSuccess;
  }

  /**
   * Sets a single document in the data manager. Merges it with the previous document, if any.
   * @protected
   * @param doc The document to add to the data manager
   * @param loaded Whether or not the document is fully loaded
   * @returns True if the set succeeded, false otherwise
   */
  public $setOne(doc: T, loaded: boolean): boolean {
    const ref = this.$getRef(doc)
    const updatedAt = this.$getUpdatedAt(doc);

    if (!isValidRef(ref)) {
      console.error(`A document attempting to be added to the ${this.collection} data manager is missing a ref.`);
      return false;
    }

    const existingCacheItem = this.$data[ref];

    const meta = buildMeta(loaded, updatedAt);
    let cacheItem = buildCacheItem(ref, doc, meta) as CacheItem<T>;

    if (existingCacheItem) {
      cacheItem = mergeCacheItems(cacheItem, existingCacheItem) as CacheItem<T>;
    }

    this.$data[ref] = cacheItem;

    if (existingCacheItem) {
      this.$updateItemInGroups(cacheItem.doc, existingCacheItem.doc)
    } else {
      this.$createItemInGroups(cacheItem.doc);
    }

    return true;
  }

  /**
   * Gets the ref for a document. Undefined refs are returned as empty strings
   * @param doc The document to parse the ref from
   * @returns A string containing the ref or an empty string
   */
  public $getRef(doc: T): string {
    if (!fieldInObject(doc, this.refField)) { return ""; }

    const ref = read(doc, this.refField);
    if (typeof ref !== "string") { return ""; }

    return ref;
  }

  /**
   * Determines the time that this document was last updated, if any
   * @param doc The doc to parse the updatedAt time from
   * @returns A number greater than or equal to 0
   */
  public $getUpdatedAt(doc: T): number {
    // Handles case where the object is missing an updated time. Defaults to 0
    if (!fieldInObject(doc, this.updatedAtField)) { return 0; }

    // In a try-catch block to prevent issues from invalid Dates
    try { 
      const value = read(doc, this.updatedAtField);
      if (typeof value !== "string" || typeof value !== "number" || typeof value !== "object") { return 0; }

      const date = new Date(value as (string | number | Date));
      return date.valueOf();

    } catch {
      return 0;
    }
  }

  /**
   * Loads documents from an external source. This function should be overloaded when a child class is created.
   * @async
   * @abstract
   * @protected 
   * @param refs A list of document references to load
   */
  protected async loadDocuments(refs: string[]): Promise<T[]> {
    const docs = [];

    for (const ref of refs) {
      const doc = this.get(ref);
      if (!doc) { continue; }
      docs.push(doc);
    }

    return docs;
  }
}



export function canLoad(cacheItem: CacheItem<unknown>, reloadPolicy: ReloadPolicy, staleTime: number) {
  // Base case. Load if the item is not loaded or the reload policy is always
  if (!cacheItem.meta.loaded || reloadPolicy === ReloadPolicy.Always) { return true; }

  switch (reloadPolicy) {
    case ReloadPolicy.Never:
      return false;
    case ReloadPolicy.IfStale:
      const now = Date.now();
      const staleAt = cacheItem.meta.loadedAt + staleTime;
      return (now > staleAt);
    default:
      console.error("An unexpected reload policy was given.")
      return false;
  }
}

/**
 * Builds a cache item
 * @param ref The reference of the document
 * @param doc The document to put into the cache item
 * @param meta The metadata for the cache item
 * @returns The completed cache item
 */
function buildCacheItem(ref: string, doc: Record<string, unknown>, meta: CacheItemMetadata): CacheItem<Record<string, unknown>> {
  return {
    ref,
    doc,
    meta
  };
}

/**
 * Builds a complete metadata object
 * @param loaded Whether or not the document is loaded in
 * @param updatedAt The last time that the document was updated according to the server
 * @returns A complete metadata object
 */
function buildMeta(loaded: boolean, updatedAt: number = 0): CacheItemMetadata {
  const meta = {
    loaded: loaded,
    loadedAt: loaded ? Date.now() : 0,
    updatedAt: updatedAt,
  };
  return meta;
}

export function isValidRef(ref: unknown) {
  if (typeof ref !== "string" || ref === "") { return false; }
  return true;
}

/**
 * Merges an old cache item with a new one
 * @param newItem The newer item
 * @param existingItem The older item
 * @returns The merged cache item
 */
function mergeCacheItems(newItem: CacheItem<Record<string, unknown>>, existingItem: CacheItem<Record<string, unknown>>): CacheItem<Record<string, unknown>> {
  // Ensures that the given item is set, but marks it as unloaded so that the next load will get the most updated value
  if (newItem.meta.updatedAt < existingItem.meta.updatedAt) { 
    newItem.meta.loaded = false;
    newItem.meta.loadedAt = 0;
    return newItem;
  }

  const mergedItem: CacheItem<Record<string, unknown>> = {
    ref: newItem.ref,
    doc: deepMerge(newItem.doc, existingItem.doc),
    meta: {
      loaded: newItem.meta.loaded || existingItem.meta.loaded,
      loadedAt: newItem.meta.loadedAt > existingItem.meta.loadedAt ? newItem.meta.loadedAt : existingItem.meta.loadedAt,
      updatedAt: newItem.meta.updatedAt,
    }
  }

  return mergedItem;
}

function buildIndexKey(params: SearchParams) {
  // Sorting or filters first? Filters - limits number that we are then required to sort. Weighted filters? Or do we want to pre-create an index for a page and then keep temporary indexes?
  // Sorting
  let sortKey = "";

  // if (!params.sort || params.sort.length === 0) { sortKey = }
  // for (const sort of params.sort) {

  // }
}

function buildSortKey(sortArr: string[]) {
  if (!sortArr || sortArr.length === 0) { return "noSort"; }
  let sortKey = "";
  for (const sortItem of sortArr) {
    // if ("&" in )
  }
}
