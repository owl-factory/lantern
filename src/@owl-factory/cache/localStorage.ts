import { isClient } from "@owl-factory/utilities/client";

// Mocks up the window.localStorage to prevent breaks serverside
const mockLocalStorage = {
  clear: () => { return; },
  getItem: (_key: string) => { return undefined; },
  removeItem: (_key: string) => { return; },
  setItem: (_key: string, _value: any) => { return; },
};

export const LOCAL_STORAGE = isClient ? window.localStorage : mockLocalStorage;
