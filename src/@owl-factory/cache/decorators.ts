import { cache } from "./CacheManager";

/**
 * A decorator that marks a function as cacheable
 * @param ttl The time to live, in minutes. Default: 30
 */
export function Cacheable(ttl = 30) {
  return (target: any, name: string, descriptor: any) => {
    const original = descriptor.value;
    descriptor.ttl = ttl;
    if (typeof original !== 'function') { return; }

    descriptor.value = async function(...args: any) {
      return await cacheWrapper(name, descriptor, (arg: any) => original.apply(this, arg), args);
    };
  };
}

/**
 * Wraps a cacheable function to intercept calls and return previously rendered results
 * @param name The name of the function
 * @param descriptor The descriptor of modifiers
 * @param original The original function to be run
 * @param args The original arguments, as an array
 * @returns The result, either from running the argument, or the cached value
 */
async function cacheWrapper(name: string, descriptor: any, original: (args: any[]) => Promise<any>, args: any[]
) {
  const originalResult = cache.get(name, args);
  if (originalResult !== undefined) { return originalResult; }
  const result = await original(args);
  cache.set(name, args, result, { ttl: descriptor.ttl });
  return result;
}
