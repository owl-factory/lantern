/**
 * GOAL: to manage a cache of data to limit the number of calls to the database that are required
 * and improve load times by caching data locally. This should also be usable on the backend to temporarily
 * persist data between different calls
 *
 * This base controller should not contain any business logic and should be reorganized to the @owl-factory directory
 */

import { Ref64 } from "types";
import { isClient } from "utilities/tools";
import { CacheItem, RefRequired } from "@owl-factory/cache/types";
import { action, makeObservable } from "mobx";

import * as access from "./functionality/access";
import * as cache from "./functionality/cache";
import * as crud from "./functionality/crud";
import { PassiveReadLevel } from "./enums";

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
      window.addEventListener('load', () => {
        this.loadCache();
      });
    }

    makeObservable(this, {
      loadCache: action,
    });
  }

  // ACCESS
  public get = access.get;
  public getPage = access.getPage;
  public readMissing = access.readMissing;
  public set = access.set;
  public setMany = access.setMany;

  // CACHE
  public loadCache = cache.loadCache;
  protected $readIfStale = cache.$readIfStale;
  protected $readIfUnloaded = cache.$readIfUnloaded;
  protected $removeMany = cache.$removeMany;
  protected $setMany = cache.$setMany;
  protected $toCacheItem = cache.$toCacheItem;

  // CRUD
  public create = crud.create;
  public createMany = crud.createMany;
  protected $createMany = crud.$createMany;
  public delete = crud.del;
  public deleteMany = crud.delMany;
  protected $deleteMany = crud.$deleteMany;
  public read = crud.read;
  public readMany = crud.readMany;
  protected $readMany = crud.$readMany;
  public update = crud.update;
  public updateMany = crud.updateMany;
  protected $updateMany = crud.$updateMany;

  /**
   * Updates the last touched time
   */
  protected touch() {
    this.lastTouched = Date.now();
  }
}

