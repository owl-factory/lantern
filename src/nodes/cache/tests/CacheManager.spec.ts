import { CacheManager } from "../controllers/CacheManager";
import { CacheItem } from "../types";

jest.mock("nodes/cache/utilities/async");

const name = "name";
const args = "args";
const value = {};
const options = { ttl: 1 };


describe("get", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });
  test("present", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache).length).toBe(1);
    const res = cache.get(name, args);
    expect(res).toBeDefined();
    expect(res).toStrictEqual(value);
  });

  test("not present", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    const res = cache.get(name, args);
    expect(res).toBeUndefined();
  });
});


describe("getItem", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });
  test("present", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache).length).toBe(1);
    const res = cache.getItem(name, args);
    expect(res).toBeDefined();
    expect((res as CacheItem).value).toStrictEqual(value);
  });

  test("not present", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    const res = cache.get(name, args);
    expect(res).toBeUndefined();
  });
});

describe("has", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });
  test("present", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache).length).toBe(1);
    const res = cache.has(name, args);
    expect(res).toBeTruthy();
  });

  test("not present", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    const res = cache.has(name, args);
    expect(res).toBeFalsy();
  });
});

describe("set", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });
  test("success", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache).length).toBe(1);
    const res = cache.has(name, args);
    expect(res).toBeTruthy();
  });
});

describe("prune", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });
  test("no delete", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache[name]).length).toBe(1);
    cache.prune(name, args);
    expect(Object.keys(cache.cache[name]).length).toBe(1);
  });

  test("delete", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache[name]).length).toBe(1);
    cache.cache[name][args].deleteAt = 0;

    cache.prune(name, args);
    expect(Object.keys(cache.cache[name]).length).toBe(0);
  });
});


describe("remove", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });
  test("success", () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, value, options);
    expect(Object.keys(cache.cache[name]).length).toBe(1);
    cache.remove(name, args);
    expect(Object.keys(cache.cache[name]).length).toBe(0);
  });

});
