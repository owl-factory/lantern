import { cache } from "../controllers/CacheManager";
import { Cacheable, cacheWrapper } from "../utilities/decorators";

jest.mock("@owl-factory/cache/async");

const ttl = 30;
const name = "name";

describe("Cacheable", () => {
  let descriptor: any;
  const mock = jest.fn();

  beforeEach(() => {
    cache.clear();
    descriptor = { value: mock };
  });

  test("success", () => {
    const fx = Cacheable(ttl);
    fx(null, name, descriptor);
    expect(descriptor.ttl).toBe(ttl);
    expect(descriptor.value).toBeDefined();
  });
});

describe("cacheWrapper", () => {
  let descriptor: any;
  const original = jest.fn(async () => true);
  const args = ["args"];

  beforeEach(() => {
    cache.clear();
    original.mockClear();
    descriptor = {
      ttl: 1,
    };
  });

  test("not cached", async () => {
    const res = await cacheWrapper(name, descriptor, original, args);
    expect(original).toBeCalledTimes(1);
    expect(res).toBeTruthy();
  });

  test("cached", async () => {
    expect(Object.keys(cache.cache).length).toBe(0);
    cache.set(name, args, false, { ttl: 1 });
    expect(Object.keys(cache.cache[name]).length).toBe(1);
    const res = await cacheWrapper(name, descriptor, original, args);
    expect(original).toBeCalledTimes(0);
    expect(res).toBeFalsy();
  });
});