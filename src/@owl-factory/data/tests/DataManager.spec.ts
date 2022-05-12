import { DataManager } from "../DataManager";
import * as caching from "../caching";
import { isValidRef } from "../helpers/fields";

import "@owl-factory/data/tests/mocks/helpers/fields";

import "@owl-factory/data/tests/mocks/crud";
import { mockBatchingController} from "@owl-factory/data/tests/mocks/batching";
import "@owl-factory/data/tests/mocks/caching";
import { mockDataController } from "@owl-factory/data/tests/mocks/data";
import { mockGroupingController} from "@owl-factory/data/tests/mocks/grouping";



jest.mock("@owl-factory/data/helpers/fields");

jest.mock("@owl-factory/data/batching", () => ({
  BatchingController: jest.fn().mockImplementation(() => mockBatchingController),
}));
jest.mock("@owl-factory/data/caching");
jest.mock("@owl-factory/data/crud");
jest.mock("@owl-factory/data/data", () => ({ DataController: jest.fn().mockImplementation(() => mockDataController) }));
jest.mock("@owl-factory/data/grouping", () => ({
  GroupingController: jest.fn().mockImplementation(() => mockGroupingController),
}));

const dm: DataManager<any> = new DataManager("/");

describe("get", () => {
  beforeEach(() => {
    (dm.data.get as any).mockClear();
  });

  test("undefined", () => {
    const result = dm.get(undefined);
    expect(result).toBe(undefined);
    expect(dm.data.get).toBeCalledTimes(0);
  });

  test("success", () => {
    const result = dm.get("1");
    expect(result).toStrictEqual({ ref: "1" });
    expect(dm.data.get).toBeCalledTimes(1);
  });

  test("fail", () => {
    const result = dm.get("fail");
    expect(result).toBe(undefined);
    expect(dm.data.get).toBeCalledTimes(1);
  });
});

describe("getMany", () => {
  beforeEach(() => {
    (dm.data.get as any).mockClear();
    (dm.data.getMany as any).mockClear();
  });

  test("all cases", () => {
    const result = dm.getMany(["", "fail", "success"]);
    expect(result).toStrictEqual([{ ref: "success" }]);
    expect(dm.data.getMany).toBeCalledTimes(1);
    expect(dm.data.get).toBeCalledTimes(3);
  });
});

describe("set", () => {
  beforeEach(() => {
    (dm.batching.addToCacheQueue as any).mockClear();
    (dm.data.get as any).mockClear();
    (dm.data.set as any).mockClear();
    (dm.grouping.onNewDoc as any).mockClear();
    (dm.grouping.onUpdatedDoc as any).mockClear();
    (isValidRef as any).mockImplementation((ref: string) => ref !== "");
  });

  test("success, new", () => {
    const result = dm.set({ ref: "fail" });
    expect(result).toBeTruthy();
    expect(dm.data.get).toBeCalledTimes(1);
    expect(dm.data.set).toBeCalledTimes(1);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(1);
    expect(dm.grouping.onNewDoc).toBeCalledTimes(1);
    expect(dm.grouping.onUpdatedDoc).toBeCalledTimes(0);
  });

  test("success, existing", () => {
    const result = dm.set({ ref: "success" });
    expect(result).toBeTruthy();
    expect(dm.data.get).toBeCalledTimes(1);
    expect(dm.data.set).toBeCalledTimes(1);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(1);
    expect(dm.grouping.onNewDoc).toBeCalledTimes(0);
    expect(dm.grouping.onUpdatedDoc).toBeCalledTimes(1);
  });

  test("failure", () => {
    const result = dm.set({ ref: "" });
    expect(result).toBeFalsy();
    expect(dm.data.get).toBeCalledTimes(0);
    expect(dm.data.set).toBeCalledTimes(0);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(0);
    expect(dm.grouping.onNewDoc).toBeCalledTimes(0);
    expect(dm.grouping.onUpdatedDoc).toBeCalledTimes(0);
  });
});

describe("setMany", () => {
  beforeEach(() => {
    (dm.batching.addToCacheQueue as any).mockClear();
    (dm.data.get as any).mockClear();
    (dm.data.set as any).mockClear();
    (dm.grouping.onNewDoc as any).mockClear();
    (dm.grouping.onUpdatedDoc as any).mockClear();
  });

  test("all states", () => {
    const result = dm.setMany([{ ref: "fail" }, { ref: "success"}, { ref: "" }]);
    expect(result).toBeDefined();
    expect(result).toBe(2);
    expect(dm.data.get).toBeCalledTimes(2);
    expect(dm.data.set).toBeCalledTimes(2);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(2);
    expect(dm.grouping.onNewDoc).toBeCalledTimes(1);
    expect(dm.grouping.onUpdatedDoc).toBeCalledTimes(1);
  });
});

describe("clear", () => {
  beforeEach(() => {
    (dm.data.clear as any).mockClear();
    (caching.clear as any).mockClear();
    (dm.grouping.clear as any).mockClear();
  });
  test("test", () => {
    dm.clear();
    expect(dm.data.clear).toBeCalledTimes(1);
    expect(caching.clear).toBeCalledTimes(1);
    expect(dm.grouping.clear).toBeCalledTimes(1);
  });
});

describe("remove", () => {

  beforeEach(() => {
    (dm.batching.addToCacheQueue as any).mockClear();
    (dm.grouping.onRemoveDoc as any).mockClear();
  });

  test("No deletes", () => {
    const result = dm.remove("fail");
    expect(result).toBe(0);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(0);
    expect(dm.grouping.onRemoveDoc).toBeCalledTimes(0);
  });

  test("1 delete", () => {
    const result = dm.remove("success");
    expect(result).toBe(1);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(1);
    expect(dm.grouping.onRemoveDoc).toBeCalledTimes(1);
  });
});

describe("removeMany", () => {

  beforeEach(() => {
    (dm.batching.addToCacheQueue as any).mockClear();
    (dm.grouping.onRemoveDoc as any).mockClear();
  });

  test("Many cases", () => {
    const result = dm.removeMany(["fail", "success"]);
    expect(result).toBe(1);
    expect(dm.batching.addToCacheQueue).toBeCalledTimes(1);
    expect(dm.grouping.onRemoveDoc).toBeCalledTimes(1);
  });
});

describe("search", () => {
  beforeEach(() => {
    (dm.data.getRefs as any).mockClear();
  });

  test("data refs", () => {
    const result = dm.search({ group: "data" });
    expect(result).toStrictEqual(["1"]);
    expect(dm.data.getRefs).toBeCalledTimes(1);
    expect(dm.grouping.getGroup).toBeCalledTimes(0);
  });

  test("any refs", () => {
    const result = dm.search({ group: "group" });
    expect(result).toStrictEqual(["1", "2"]);
    expect(dm.data.getRefs).toBeCalledTimes(0);
    expect(dm.grouping.getGroup).toBeCalledTimes(1);
  });
});

describe("addGroup", () => {
  beforeEach(() => {
    (dm.data.getAll as any).mockClear();
    (dm.grouping.addGroup as any).mockClear();
  });

  test("test", () => {
    dm.addGroup("name", (_doc: any) => true);
    expect(dm.data.getAll).toBeCalledTimes(1);
    expect(dm.grouping.addGroup).toBeCalledTimes(1);
  });
});

describe("removeGroup", () => {
  beforeEach(() => {
    (dm.grouping.removeGroup as any).mockClear();
  });

  test("test", () => {
    dm.removeGroup("name");
    expect(dm.grouping.removeGroup).toBeCalledTimes(1);
  });
});

describe("cacheAction", () => {
  beforeEach(() => {
    (caching.remove as any).mockClear();
    (caching.set as any).mockClear();
    (caching.setRefs as any).mockClear();
  });

  test("remove", () => {
    dm.cacheAction(["fail"]);
    expect(caching.remove).toBeCalledTimes(1);
    expect(caching.set).toBeCalledTimes(0);
    expect(caching.setRefs).toBeCalledTimes(1);
  });

  test("set", () => {
    dm.cacheAction(["success"]);
    expect(caching.remove).toBeCalledTimes(0);
    expect(caching.set).toBeCalledTimes(1);
    expect(caching.setRefs).toBeCalledTimes(1);
  });
});

describe("create",  () => {
  test("test", async () => {
    const result = await dm.create({ ref: "ref" });
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].doc.ref).toBe("create");
  });
});

describe("read",  () => {
  test("test", async () => {
    const result = await dm.read(["1"]);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].doc.ref).toBe("read");
  });
});

describe("update",  () => {
  test("test", async () => {
    const result = await dm.update({ ref: "ref" });
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].doc.ref).toBe("update");
  });
});

describe("delete",  () => {
  test("test", async () => {
    const result = await dm.create(["1", "2"]);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].doc.ref).toBe("create");
  });
});
