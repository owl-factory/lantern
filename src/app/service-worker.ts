import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScopeEventMap & {
  // This should match the next.config.mjs `withSerwistInit.injectionPoint` path string.
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

console.log(self);

const revision = crypto.randomUUID();

installSerwist({
  // TODO figure out cache strategy that excludes /api/ping
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        revision,
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});
