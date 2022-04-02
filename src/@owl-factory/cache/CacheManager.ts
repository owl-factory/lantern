import { argsToString, buildCacheItem } from "./helpers";
import { Cache, CacheOptions } from "./types";


class CacheManager {
  public cache: Cache = {};

  /**
   * Fetches the cached value for the function and arguments
   * @param name The name of the function to check
   * @param args An array of the arguments
   * @returns The cached value. Undefined if there is none
   */
  public get(name: string, args: any): any | undefined {
    const functionCache = this.cache[name];
    if (functionCache === undefined) { return undefined; }

    const argString = argsToString(args);
    const cacheItem = this.cache[name][argString];
    if (cacheItem === undefined) { return undefined; }

    if (cacheItem.deleteAt < Date.now()) {
      delete this.cache[name][argString];
      return undefined;
    }

    return cacheItem.value;
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
    const cacheItem = buildCacheItem(value, options);
    this.cache[name][argString] = cacheItem;
  }
}

export const cache = new CacheManager();

