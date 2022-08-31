import { setPruneTimeout } from "../utilities/async";
import { argsToString, buildCacheItem } from "../utilities/helpers";
import { Cache, CacheItem, CacheOptions } from "../types";

// A controller for managing the storage of data on the front and backend.
export class CacheManager {
  public cache: Cache = {};

  /**
   * Fetches the cached value for the function and arguments
   * @param name The name of the function to check
   * @param args An array of the arguments
   * @returns The cached value. Undefined if there is none
   */
  public get(name: string, args: any): any | undefined {
    const cacheItem = this.getItem(name, args);
    if (cacheItem === undefined) { return undefined; }
    return cacheItem.value;
  }

  /**
   * Fetches the cached item for the function name and arguments
   * @param name The name of the function to check
   * @param args An array of the arguments
   * @returns The cached item. Undefined if there is none
   */
  public getItem(name: string, args: any): CacheItem | undefined {
    const functionCache = this.cache[name];
    if (functionCache === undefined) { return undefined; }

    const argString = argsToString(args);
    const cacheItem = this.cache[name][argString];
    if (cacheItem === undefined) { return undefined; }

    if (cacheItem.deleteAt < Date.now()) {
      delete this.cache[name][argString];
      return undefined;
    }

    return cacheItem;
  }

  /**
   * Determines if there is a cached value for the function and arguments
   * @param name The name of the function to check
   * @param args An array of the arguments
   * @returns True if the cached value exists
   */
  public has(name: string, args: any) {
    const value = this.get(name, args);
    return (value !== undefined);
  }

  /**
   * Sets the received value in the cache
   * @param name The name of the function to check
   * @param args An array of the arguments
   * @param value The value to store to the cache
   * @param options Options for altering how the data is stored
   */
  public set(name: string, args: any, value: any, options: CacheOptions) {
    if (!(this.cache[name])) { this.cache[name] = {}; }

    const argString = argsToString(args);
    const cacheItem = buildCacheItem(name, args, value, options);
    this.cache[name][argString] = cacheItem;
  }

  /**
   * A function that determines if a cached result can be pruned, and removes it if it does
   * @param name The name of the function to check
   * @param args An array of the arguments
   */
  public prune(name: string, args: any) {
    const item = this.getItem(name, args);
    if (item === undefined) { return; }

    const now = Date.now();
    if (item.deleteAt > now) {
      clearTimeout(item.prune);
      item.prune = setPruneTimeout(name, args, item.deleteAt - now);
      return;
    }

    this.remove(name, args);
  }

  /**
   * Removes a single item from the cache
   * @param name The name of the function to check
   * @param args An array of the arguments
   */
  public remove(name: string, args: any) {
    const functionCache = this.cache[name];
    if (functionCache === undefined) { return; }

    const argString = argsToString(args);
    delete functionCache[argString];
    console.log("removed");
  }

  /**
   * Resets the CacheManager
   */
  public clear() {
    this.cache = {};
  }
}

export const cache = new CacheManager();

