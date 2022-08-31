import { Ref64 } from "@owl-factory/types";

/**
 * Handles all of the command batching for the Data Manager. The goal is to allow for saving cycles
 * by batching non-critical tasks together, like updating information in the cache, or to prevent running
 * the same code multiple times from different calls
 */
export class BatchingController {
  public cacheQueue: Record<Ref64, 1> = {};
  public cacheTimeout = false;
  public cacheAction: (refs: Ref64[]) => void;
  public cacheDelay: number;

  constructor(
    cacheAction: (refs: Ref64[]) => void,
    cacheDelay: number
  ) {
    this.cacheAction = cacheAction;
    this.cacheDelay = cacheDelay;
  }

  /**
   * Adds a single ref to the cache queue. If not present, it also initializes the batch function to run
   * @param ref The ref to add to the cache queue, marking it as updated
   */
  public addToCacheQueue(ref: Ref64) {
    this.cacheQueue[ref] = 1;
    if (this.cacheTimeout === false) {
      setTimeout(() => this.runCacheBatch(), this.cacheDelay);
      this.cacheTimeout = true;
    }
  }

  /**
   * Runs the cache batch
   */
  public runCacheBatch() {
    const refs = Object.keys(this.cacheQueue);
    this.cacheQueue = {};
    this.cacheTimeout = false;

    this.cacheAction(refs);
  }
}
