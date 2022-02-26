import { newCacheItem, newMetadata } from "@owl-factory/data/helpers/caching";
import { DataManager } from "../../AbstractDataManager";

describe("DataManager Data Functions", () => {
  let data: DataManager<Record<string, unknown>>;

  beforeEach(() => {
    data = new DataManager();
    const cacheItem1 = newCacheItem("1", { ref: "1" }, newMetadata(false, 0));
    const cacheItem2 = newCacheItem("2", { ref: "2" }, newMetadata(true, 0));
    data.$data = { [cacheItem1.ref]: cacheItem1, [cacheItem2.ref]: cacheItem2 };
    data.addGroup("testAll", (_doc) => true);
    data.addGroup("testOne", (doc) => doc?.ref === "2");
  });

  test("clear", () => {
    expect(Object.keys(data.$data).length).toBe(2);
    expect(data.$groups.testAll.length).toBe(2);

    data.clear();

    expect(Object.keys(data.$data).length).toBe(0);
    expect(data.$groups.testAll.length).toBe(0);
  });

  test("get existing", () => {
    const doc = data.get("1");

    expect(doc).toBeDefined();
    expect(doc?.ref).toBe("1");
  });

  test("get non-existing", () => {
    const doc = data.get("a");

    expect(doc).toBeUndefined();
  });

  test("get many existing", () => {
    const docs = data.getMany(["1", "2"]);

    expect(docs.length).toBe(2);
    expect(docs[0].ref).toBe("1");
  });

  test("get many mixed", () => {
    const docs = data.getMany(["a", "2"]);

    expect(docs.length).toBe(1);
    expect(docs[0].ref).toBe("2");
  });

  test("get many all undefined", () => {
    const docs = data.getMany(["a", "b", "c"]);

    expect(docs.length).toBe(0);
  });

  // test("load", () => {

  // })

  // TODO - expand search tests later as the search gets more complicated. Perhaps move to own file
  test("search data group", () => {
    const docs = data.search({group: "data"});

    expect(docs.length).toBe(2);
  });

  test("search testOne group", () => {
    const docs = data.search({ group: "testOne" });

    expect(docs.length).toBe(1);
    expect(docs[0]).toBe("2");
  });

  test("search no group", () => {
    const docs = data.search();

    expect(docs.length).toBe(0);
  });

  test("search missing group", () => {
    const docs = data.search({ group: "missing" });
    expect(docs.length).toBe(0);
  });

  test("set new valid", () => {
    const doc = { ref: "3" };
    data.set(doc);

    expect(Object.keys(data.$data).length).toBe(3);
    expect(data.$groups.testAll.length).toBe(3);
    expect(data.$groups.testOne.length).toBe(1);
  });

  test("set update existing", () => {
    const doc = { ref: "1", boop: 1 };
    data.set(doc);

    expect(Object.keys(data.$data).length).toBe(2);
    expect(data.$groups.testAll.length).toBe(2);
    expect(data.$groups.testOne.length).toBe(1);
    expect(data.$data["1"].doc).toBeDefined();
    expect(data.$data["1"].doc.boop).toBeDefined();
    expect(data.$data["1"].doc.boop).toBe(1);
  });

  test("set invalid", () => {
    const doc = {};
    data.set(doc);

    expect(Object.keys(data.$data).length).toBe(2);
    expect(data.$groups.testAll.length).toBe(2);
    expect(data.$groups.testOne.length).toBe(1);
  });
});
