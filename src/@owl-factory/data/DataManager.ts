import { Packet } from "@owl-factory/cache/types";
import { Ref64 } from "@owl-factory/types";
import { isClient } from "@owl-factory/utilities/client";
import { action, makeObservable, observable } from "mobx";
import { DataController } from "./data";
import { CacheMethod, ReloadPolicy } from "./enums";
import * as caching from "./functionality/caching";
import * as data from "./functionality/data";
import * as fields from "./functionality/fields";
import * as grouping from "./functionality/grouping";
import { mergePackets as mergePackets, newMetadata, newPacket } from "./helpers/caching";
import { canLoad } from "./helpers/loading";
import { GroupingController } from "./grouping";
import { SearchParams } from "./types";



/**
 * The top level Data Managing class with an API for accessing and searching data
 */
export class DataManager<T extends Record<string, unknown>> {
  protected collection = "data"; // The name of the data collection. Used for logs and caching

  // Configuration //
  public reloadPolicy = ReloadPolicy.IfStale;
  public staleTime = 30 * 60 * 1000;

  public lastTouched = 0;
  public data: DataController<T>;
  public grouping: GroupingController<T>;

  constructor() {
    this.data = new DataController(this.staleTime);
    this.grouping = new GroupingController();
  }

  /**
   * Fetches a single document
   * @param ref The reference to the desired document
   * @returns The document, if found. Undefined otherwise
   */
  public get(ref: Ref64): T | undefined {
    const packet = this.data.get(ref);
    if (!packet) { return undefined; }
    return packet.doc;
  }

  /**
   * Fetches multiple documents
   * @param refs The references to the desired documents
   * @returns An array of documents
   */
  public getMany(refs: Ref64[]): T[] {
    const packets = this.data.getMany(refs);
    const docs: T[] = [];
    for (const packet of packets) { docs.push(packet.doc); }
    return docs;
  }

  /**
   * Saves a document locally
   * @param doc The document to save
   * @param loaded Indicates that the document is loaded. Defaults to false
   * @returns True if the document was saved successfully, false otherwise
   */
  public set(doc: T, loaded = false): boolean {
    const ref = doc.ref as string;
    const updatedAt = getUpdatedAt(doc);

    // Ref check! We can't save if there's no ref
    if (!isValidRef(ref)) {
      console.error(`A document attempting to be added to the ${this.collection} data manager is missing a ref.`);
      return false;
    }
    const oldPacket = this.data.get(ref);
    const metadata = newMetadata(loaded, updatedAt);
    const packet = newPacket(doc, metadata) as Packet<T>;

    const savedPacket = this.data.set(packet);
    // Add to cache
    // Update in groups
    if (oldPacket !== undefined) { this.grouping.onUpdatedDoc(savedPacket.doc, oldPacket.doc)}
    else { this.grouping.onNewDoc(savedPacket.doc); }

    this.touch();

    return true;
  }

  /**
   * Saves a number of documents locally
   * @param docs A list of documents to save
   * @returns The number of documents successfully saved
   */
  public setMany(docs: T[], loaded = false): number {
    let successCount = 0;
    for (const doc of docs) {
      const result = this.set(doc, loaded);
      if (result) { successCount++; }
    }

    this.touch();

    return successCount;
  }

  /**
   * Loads one or many documents from the database
   * @param targetRefs The refs to load from the database
   */
  public async load(targetRefs: Ref64, reloadPolicy?: ReloadPolicy): Promise<void> {
    const refs = Array.isArray(targetRefs) ? targetRefs : [targetRefs];
    const loadedDocs = await this.data.load(refs, reloadPolicy || this.reloadPolicy, this.loadDocuments);

    this.setMany(loadedDocs, true);

    // Other caching and saving are handled in setMany

    return;
  }

  /**
   * Clears all data. For use when a user logs out or in
   */
  public clear(): void {
    this.data.clear();
    // Clear cache
    // Clear grouping
    this.grouping.clear();
    return;
  }

  /**
   * Removes a single document from the local data stores. Does not remove it from the database
   * @param ref Removes a single document
   * @returns The number of documents removed
   */
  public remove(ref: Ref64): number {
    const deletedPacket = this.data.remove(ref);
    if (!deletedPacket) { return 0; }
    // Remove in cache
    // Remove in searching
    this.grouping.onRemoveDoc(deletedPacket.doc);
    return 1;
  }

  /**
   * Removes the documents with the given refs from the data
   * @param refs A list of refs for documents to remove
   * @returns The number of documents deleted
   */
  public removeMany(refs: Ref64): number {
    let totalDeleteCount = 0;
    for (const ref of refs) {
      const deleteCount = this.remove(ref);
      totalDeleteCount += deleteCount;
    }
    return totalDeleteCount;
  }

  public search(parameters: SearchParams): Ref64[] {
    let refs: Ref64[] = [];
    if (parameters.group === "data") { refs = Object.keys(this.data.getAll()); }
    else { refs = this.grouping.getGroup(parameters.group || ""); }
    return refs;
  }

  public touch(): void {
    this.lastTouched = Date.now();
  }

  public async loadDocuments(refs: Ref64[]): Promise<T[]> {
    return [];
  }

  public addGroup(name: string, validation: (doc: T) => boolean) {
    const allData = this.data.getAll();
    this.grouping.addGroup(name, validation, allData);
  }

  public removeGroup(name: string): number {
    return this.grouping.removeGroup(name);
  }


  // protected refField = "ref"; // The field containing a unique ID for the document
  // protected updatedAtField = "updatedAt"; // The field containing the document's last updated time
  // protected collection = "data"; // The name of the collection of data. Used for logs and caching

  // // protected cacheMethod = CacheMethod.LocalStorage; // The location that the data will be cached at
  // // The policy for determining if a document should be reloaded if already loaded
  // protected reloadPolicy = ReloadPolicy.IfStale;

  // protected staleTime = 1000 * 60 * 30; // The time until a document becomes stale in milliseconds

  // public $data: Record<string, CacheItem<T>> = {}; // The bucket that holds all data loaded into the data manager
  // // A collection of lists of refs for data that fits into a specific group
  // public $groups: Record<string, string[]> = {};
  //  // Functions that determine if a document fits into a group
  // public $groupValidation: Record<string, (doc: T) => boolean> = {};
  // public $indexes: Record<string, unknown> = {}; // UNUSED

  // // A set of records that will be updated the next time the cache queue is emptied
  // // protected $cacheQueue: Record<string, number> = {};
  // // protected $cacheBatchJob!: NodeJS.Timeout;
  // // protected $cacheBatchDelay = 1000 * 60 * 5;

  // protected $loadQueue: Record<string, number> = {};
  // protected $loadBatchJob!: NodeJS.Timeout;
  // protected $loadBatchDelay = 1000 * 0.5; // Default delay of a half second. Decrease possibly?

  // public $lastTouched = 0;

  // constructor() {
  //   if (isClient) {
  //     window.addEventListener("load", () => {
  //       // this.$loadCache();
  //       // this.$initializeCacheBatchJob();
  //     });

  //     // Functions to run if we're hard refreshing or going to a different site
  //     window.onbeforeunload = () => {
  //       // this.$runCacheQueue();
  //     };

  //     makeObservable(this, {
  //       // $loadCache: action,
  //       setMany: action,
  //       set: action,
  //       $setCacheItem: action,
  //       touch: action,

  //       $data: observable,
  //       $groups: observable,
  //       $lastTouched: observable,
  //     });
  //   }
  // }

  // public clear = data.clear;
  // public get = data.get;
  // public getMany = data.getMany;
  // public load = data.load;
  // public search = data.search;
  // public set = data.set;
  // public $setCacheItem = data.setCacheItem;
  // public setMany = data.setMany;

  // // protected $clearCache = caching.clearCache;
  // // protected $initializeCacheBatchJob = caching.initializeCacheBatchJob;
  // // public $loadCache = caching.loadCache;
  // // protected $runCacheQueue = caching.runCacheQueue;
  // // protected $markUpdated = caching.markUpdated;
  // // protected $saveCache = caching.saveCache;

  // public addGroup = grouping.addGroup;
  // public removeGroup = grouping.removeGroup;
  // public $clearGroups = grouping.clearGroups;
  // protected $createItemInGroups = grouping.createItemInGroups;
  // protected $removeItemFromGroups = grouping.removeItemFromGroups;
  // protected $updateItemInGroups = grouping.updateItemInGroups;

  // get lastTouched() { return this.$lastTouched; }
  // public touch() { this.$lastTouched = Date.now(); }

  // public $getUpdatedAt = fields.getUpdatedAt;

  // /**
  //  * Loads documents from an external source. This function should be overloaded when a child class is created.
  //  * @async
  //  * @abstract
  //  * @protected
  //  * @param refs A list of document references to load
  //  */
  // protected async loadDocuments(refs: string[]): Promise<T[]> {
  //   const docs = [];

  //   for (const ref of refs) {
  //     const doc = this.get(ref);
  //     if (!doc) { continue; }
  //     docs.push(doc);
  //   }

  //   return docs;
  // }
}



export function isValidRef(ref: unknown) {
  if (typeof ref !== "string" || ref === "") { return false; }
  return true;
}


/**
 * Determines the time that this document was last updated, if any. If none is found, returns 0
 * @protected
 * @param doc The doc to parse the updatedAt time from
 * @returns A number greater than or equal to 0
 */
export function getUpdatedAt<T extends Record<string, unknown>>(doc: T): number {
  // Handles case where the object is missing an updated time. Defaults to 0
  if (doc.updatedAt === undefined) { return 0; }

  // In a try-catch block to prevent issues from invalid Dates
  try {
    const updatedAt = doc.updatedAt;
    if (typeof updatedAt !== "string" && typeof updatedAt !== "number" && typeof updatedAt !== "object") { return 2; }

    const date = new Date(updatedAt as (string | number | Date));
    // Case with invalid value (eg empty object) causing the value to be not a number
    if (isNaN(date.valueOf())) { return 0; }
    return date.valueOf();

  } catch {
    return 0;
  }
}
