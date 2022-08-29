import { cache } from "../controllers/CacheManager";

/**
 * Creates a timeout function for pruning
 * @param name The name of the function to check
 * @param args An array of the arguments
 * @param ttl The time to live, in milliseconds
 * @returns A reference to the setTimeout function
 */
export function setPruneTimeout(name: string, args: any, ttl: number) {
  return setTimeout(() => cache.prune(name, args), ttl);
}
