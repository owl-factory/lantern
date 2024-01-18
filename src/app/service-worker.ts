/*
 * This file is used to build a service worker in `public` when the site is built.
 * The service worker uses tools from https://serwist.pages.dev/.
 * A service worker is required to make Lantern an offline-capable Progressive Web App.
 */

import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScopeEventMap & {
  // This should match the next.config.mjs `withSerwistInit.injectionPoint` path string.
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

/* This overrides Serwist's default cache setting for Next API endpoints to not cache (require a network connection.)
 * defaultCache is passed to runtimeCaching setting, an array of cache settings that decided how to handle caching for
 * sets of URLs matched with a function or regular expression.
 * TODO handle runtimeCaching configuration ourselves in a caching.ts file or similar.
 */
defaultCache[12].handler = "NetworkOnly";

const revision = crypto.randomUUID();

installSerwist({
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
