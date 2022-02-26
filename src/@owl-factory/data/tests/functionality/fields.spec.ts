import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { newCacheItem, newMetadata } from "@owl-factory/data/helpers/caching";

describe("DataManager fields", () => {
  let data: DataManager<Record<string, unknown>>;

  beforeEach(() => {
    data = new DataManager();
    const cacheItem1 = newCacheItem("1", { ref: "1" }, newMetadata(false, 0));
    const cacheItem2 = newCacheItem("2", { ref: "2" }, newMetadata(true, 0));
    data.$data = { [cacheItem1.ref]: cacheItem1, [cacheItem2.ref]: cacheItem2 };
    data.addGroup("testAll", (_doc) => true);
    data.addGroup("testOne", (doc) => doc?.ref === "2");
  });

  test("getRef valid", () => {
    const ref = data.$getRef({ ref: "3" });

    expect(ref).toBe("3");
  });

  test("getRef missing ref", () => {
    const ref = data.$getRef({ });

    expect(ref).toBe("");
  });

  test("getRef invalid type", () => {
    const ref = data.$getRef({ ref: 1 });

    expect(ref).toBe("");
  });

  test("getUpdatedAt valid", () => {
    const now = new Date();
    const updatedAt = data.$getUpdatedAt({ updatedAt: 15 });
    const updatedAtDate = data.$getUpdatedAt({ updatedAt: now });

    // expect(updatedAt).toBe(15);
    expect(updatedAtDate).toBe(now.valueOf());
  });

  test("getUpdatedAt no updatedAt", () => {
    const updatedAt = data.$getUpdatedAt({ });
    expect(updatedAt).toBe(0);
  });

  test("getUpdatedAt invalid type", () => {
    const updatedAt = data.$getUpdatedAt({ updatedAt: {} });
    expect(updatedAt).toBe(0);
  });
});
