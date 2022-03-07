import { DataManager } from "@owl-factory/data/DataManager";
import { newPacket, newMetadata } from "@owl-factory/data/helpers/caching";

describe("DataManager fields", () => {
  let data: DataManager<Record<string, unknown>>;

  beforeEach(() => {
    data = new DataManager();
    const cacheItem1 = newPacket("1", { ref: "1" }, newMetadata(false, 0));
    const cacheItem2 = newPacket("2", { ref: "2" }, newMetadata(true, 0));
    data.$data = { [cacheItem1.ref]: cacheItem1, [cacheItem2.ref]: cacheItem2 };
    data.addGroup("testAll", (_doc) => true);
    data.addGroup("testOne", (doc) => doc?.ref === "2");
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
