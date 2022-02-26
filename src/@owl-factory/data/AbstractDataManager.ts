import { CacheItem } from "@owl-factory/cache/types";
import { isClient } from "@owl-factory/utilities/client";
import { action, makeObservable, observable } from "mobx";
import { CacheMethod, ReloadPolicy } from "./enums";
import * as caching from "./functionality/caching";
import * as data from "./functionality/data";
import * as fields from "./functionality/fields";
import * as grouping from "./functionality/grouping";



export class DataManager<T extends Record<string, unknown>> {
  protected refField = "ref"; // The field containing a unique ID for the document
  protected updatedAtField = "updatedAt"; // The field containing the document's last updated time
  protected collection = "data"; // The name of the collection of data. Used for logs and caching

  // protected cacheMethod = CacheMethod.LocalStorage; // The location that the data will be cached at
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
  // protected $cacheQueue: Record<string, number> = {};
  // protected $cacheBatchJob!: NodeJS.Timeout;
  // protected $cacheBatchDelay = 1000 * 60 * 5;

  protected $loadQueue: Record<string, number> = {};
  protected $loadBatchJob!: NodeJS.Timeout;
  protected $loadBatchDelay = 1000 * 0.5; // Default delay of a half second. Decrease possibly?

  public $lastTouched = 0;

  constructor() {
    if (isClient) {
      window.addEventListener("load", () => {
        // this.$loadCache();
        // this.$initializeCacheBatchJob();
      });

      // Functions to run if we're hard refreshing or going to a different site
      window.onbeforeunload = () => {
        // this.$runCacheQueue();
      };

      makeObservable(this, {
        // $loadCache: action,
        setMany: action,
        set: action,
        $setCacheItem: action,
        touch: action,

        $data: observable,
        $groups: observable,
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
  public $setCacheItem = data.setCacheItem;
  public setMany = data.setMany;

  // protected $clearCache = caching.clearCache;
  // protected $initializeCacheBatchJob = caching.initializeCacheBatchJob;
  // public $loadCache = caching.loadCache;
  // protected $runCacheQueue = caching.runCacheQueue;
  // protected $markUpdated = caching.markUpdated;
  // protected $saveCache = caching.saveCache;

  public addGroup = grouping.addGroup;
  public removeGroup = grouping.removeGroup;
  public $clearGroups = grouping.clearGroups;
  protected $createItemInGroups = grouping.createItemInGroups;
  protected $removeItemFromGroups = grouping.removeItemFromGroups;
  protected $updateItemInGroups = grouping.updateItemInGroups;

  get lastTouched() { return this.$lastTouched; }
  public touch() { this.$lastTouched = Date.now(); }

  public $getRef = fields.getRef;
  public $getUpdatedAt = fields.getUpdatedAt;

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



export function isValidRef(ref: unknown) {
  if (typeof ref !== "string" || ref === "") { return false; }
  return true;
}


