import { Packet } from "../types";
import { ReloadPolicy } from "../enums";

/**
 * Determines if a cache item can be or should be loaded or reloaded.
 * @param cacheItem The cache item to examine
 * @param reloadPolicy The reload policy to use in determining the time to reload
 * @param staleTime The time before a cache item is marked as stale, in milliseconds
 * @returns True if the item meets loading criteria. False otherwise.
 */
export function canLoad(cacheItem: Packet<unknown>, reloadPolicy: ReloadPolicy, staleTime: number) {
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
      console.error("An unexpected reload policy was given.");
      return false;
  }
}
