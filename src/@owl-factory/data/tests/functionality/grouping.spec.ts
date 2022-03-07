import { DataManager } from "@owl-factory/data/DataManager";
import { newPacket, newMetadata } from "@owl-factory/data/helpers/caching";

describe("DataManager fields", () => {
  let data: DataManager<Record<string, unknown>>;

  beforeEach(() => {
    data = new DataManager();
    const cacheItem1 = newPacket("1", { ref: "1" }, newMetadata(false, 0));
    const cacheItem2 = newPacket("2", { ref: "2" }, newMetadata(true, 0));
    data.$data = { [cacheItem1.ref]: cacheItem1, [cacheItem2.ref]: cacheItem2 };

  });

  test("addGroup success", () => {
    expect(Object.keys(data.$groups).length).toBe(0);
    expect(Object.keys(data.$groupValidation).length).toBe(0);

    data.addGroup("testOne", (doc) => doc?.ref === "2");

    expect(Object.keys(data.$groups).length).toBe(1);
    expect(Object.keys(data.$groupValidation).length).toBe(1);

    expect(data.$groups.testOne.length).toBe(1);
    expect(data.$groups.testOne[0]).toBe("2");
  });

  test("addGroup already exists", () => {
    expect(Object.keys(data.$groups).length).toBe(0);
    expect(Object.keys(data.$groupValidation).length).toBe(0);

    data.addGroup("testOne", (doc) => doc?.ref === "2");

    expect(Object.keys(data.$groups).length).toBe(1);
    expect(Object.keys(data.$groupValidation).length).toBe(1);

    data.addGroup("testOne", (doc) => doc?.ref === "1");

    expect(Object.keys(data.$groups).length).toBe(1);
    expect(Object.keys(data.$groupValidation).length).toBe(1);

    expect(data.$groups.testOne.length).toBe(1);
    expect(data.$groups.testOne[0]).toBe("2");
  });

  test("remove group", () => {
    expect(Object.keys(data.$groups).length).toBe(0);
    expect(Object.keys(data.$groupValidation).length).toBe(0);

    data.addGroup("testOne", (doc) => doc?.ref === "2");

    expect(Object.keys(data.$groups).length).toBe(1);
    expect(Object.keys(data.$groupValidation).length).toBe(1);

    data.removeGroup("testOne");

    expect(Object.keys(data.$groups).length).toBe(0);
    expect(Object.keys(data.$groupValidation).length).toBe(0);
  });

  test("clearGroups", () => {
    expect(Object.keys(data.$groups).length).toBe(0);
    expect(Object.keys(data.$groupValidation).length).toBe(0);

    data.addGroup("testOne", (doc) => doc?.ref === "2");

    expect(Object.keys(data.$groups).length).toBe(1);
    expect(Object.keys(data.$groupValidation).length).toBe(1);
    expect(data.$groups.testOne.length).toBe(1);
    expect(data.$groups.testOne[0]).toBe("2");

    data.$clearGroups();
    expect(Object.keys(data.$groups).length).toBe(1);
    expect(Object.keys(data.$groupValidation).length).toBe(1);
    expect(data.$groups.testOne.length).toBe(0);
  });

  // TODO - create, remove, update item in groups testing
});
