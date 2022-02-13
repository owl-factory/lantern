import { CacheItem, CacheItemMetadata } from "@owl-factory/cache/types";
import { deepMerge, fieldInObject, read } from "@owl-factory/utilities/objects";

// The method for where the Data Manager will store data
enum CacheMethod {
  LocalStorage,
}

// The policy for how the DataManager will reload a document if the document is already loaded
enum ReloadPolicy {
  Never, // Never reloads the document if it is already loaded in
  IfStale, // Reloads the document when the document has become stale
  Always, // Always reloads the document when called, even if already loaded in
}

export class DataManager<T extends Record<string, unknown>> {
  protected readonly refField = "ref"; // The field containing a unique ID for the document
  protected readonly updatedAtField = "updatedAt"; // The field containing the document's last updated time
  public readonly collection = "data"; // The name of the collection of data. Used for logs and caching

  public readonly cacheMethod = CacheMethod.LocalStorage; // The location that the data will be cached at
  public readonly reloadPolicy = ReloadPolicy.IfStale; // The policy for determining if a document should be reloaded if already loaded

  public readonly staleTime = 1000 * 60 * 30; // The time until a document becomes stale in milliseconds

  public $data: Record<string, CacheItem<T>> = {};

  public $lastTouched = 0;

  constructor() {
    window.addEventListener("load", () => {
      // this.$cacheLoad();
    })
  }

  /**
   * Gets a single document from the data manager
   * @param ref The reference of the document to fetch
   * @returns The found document, if present. Undefined otherwise
   */
  public get(ref: string): T | undefined {
    if (!(ref in this.$data)) { return undefined; }
    return this.$data[ref].doc;
  }

  /**
   * Adds a single document to the data manager. Merges with any existing document if newer and replaces if older.
   * @param doc The document to set in the data manager
   * @returns True if adding the document was successful. False otherwise.
   */
  public set(doc: T): boolean {
    const result = this.setMany([doc]);
    return result;
  }

  /**
   * Sets many document in the data manager. Merges them with any existing document if newer, and replaces if older.
   * @param docs A list of documents to add to the data manager
   * @returns True if adding any document succeeded. False if all of them failed.
   */
  public setMany(docs: T[]): boolean {
    this.$setMany(docs, false);
    return false;
  }

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
    let cacheItem = buildCacheItem(ref, doc, meta);

    if (existingCacheItem) {
      cacheItem = mergeCacheItems(cacheItem, existingCacheItem);
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
   * Ensures one or many documents are loaded into the data manager
   * @async
   * @param ref The reference of the document to load
   * @param reloadPolicy A reload policy to use instead of the default
   * @returns True if the load was successful. False otherwise
   */
  public async load(ref: string | string[], reloadPolicy: ReloadPolicy = this.reloadPolicy): Promise<boolean> {
    const refs = Array.isArray(ref) ? ref : [ref];
    const loadRefs: string[] = [];

    // Checks which documents to we can load
    for (const ref of refs) {
      const cacheItem = this.$data[ref];
      if (!cacheItem) { continue; }
      if (canLoad(cacheItem, reloadPolicy, this.staleTime)) { loadRefs.push(ref); }
    }

    // Prevents unneeded calls from being made if the target refs are empty
    if (loadRefs.length === 0) { return true; }

    const docs = await this.loadDocuments(loadRefs);
    if (!Array.isArray(docs) || docs.length === 0) { return false; } // Unexpected error

    // Set Many
    return this.$setMany(docs, true);
  }

  /**
   * Loads documents from an external source.
   * @async
   * @abstract
   * @protected 
   * @param refs A list of document references to load
   */
  public async loadDocuments(refs: string[]): Promise<T[]> {
    const docs = [];

    for (const ref of refs) {
      const doc = this.get(ref);
      if (!doc) { continue; }
      docs.push(doc);
    }

    return docs;
  }

  /**
   * Searches through the data and finds documents that match the search criteria
   * @param params The parameters to use for searching, sorting, and paginating
   * @returns An array of documents matching the criteria
   */
  public search(params: SearchParams) {
    return [];
  }

  /**
   * Clears all data from the data manager and cache. 
   */
  public clear() {
    return;
  }
}

interface SearchParams {
  page: number; // The page of data to pull
  perPage: number; // The number of documents per page
  sort: string[]; // The order of fields and the direction that they should be sorted
  filters: Record<string, string>; // The fields to filter
}

function canLoad(cacheItem: CacheItem<unknown>, reloadPolicy: ReloadPolicy, staleTime: number) {
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

function buildCacheItem(ref: string, doc: Record<string, unknown>, meta: CacheItemMetadata): CacheItem<Record<string, unknown>> {
  return {
    ref,
    doc,
    meta
  };
}

function buildMeta(loaded: boolean, updatedAt: number = 0): CacheItemMetadata {
  const meta = {
    loaded: loaded,
    loadedAt: loaded ? Date.now() : 0,
    updatedAt: updatedAt,
  };
  return meta;
}

function isValidRef(ref: unknown) {
  if (typeof ref !== "string" || ref === "") { return false; }
  return true;
}

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

function save(item: CacheItem<unknown>) {

}