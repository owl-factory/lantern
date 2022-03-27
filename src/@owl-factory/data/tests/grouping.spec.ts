import { GroupingController } from "@owl-factory/data/grouping";

let gc: GroupingController<Record<string, unknown>>;
let doc1: Record<string, unknown>;
let doc2: Record<string, unknown>;

describe("getGroup", () => {
  beforeEach(() => {
    gc = new GroupingController();
    doc1 = { ref: "1" };
    doc2 = { ref: "2" };
  });

  test("empty", () => {
    const res = gc.getGroup("this-doesnt-exist");
    expect(res).toStrictEqual([]);
  });

  test("populated", () => {
    const name = "test";
    const refs = ["1", "2", "3"];
    gc.groups[name] = refs;
    const res = gc.getGroup(name);
    expect(res).toStrictEqual(refs);
  });
});

describe("addGroup", () => {
  const name = "test";
  const mockValidation = jest.fn(() => false);
  const data = {
    "1": { ref: "1", meta: { loaded: false, loadedAt: 0, updatedAt: 0 }, doc: {} },
  };

  beforeEach(() => {
    mockValidation.mockClear();
    gc.clear();
  });

  test("success", () => {
    expect(Object.keys(gc.groups).length).toBe(0);
    gc.addGroup(name, mockValidation, data);
    expect(Object.keys(gc.groups).length).toBe(1);
    expect(Object.keys(gc.validators).length).toBe(1);
    expect(mockValidation).toBeCalledTimes(1);
  });

  test("already exists", () => {
    gc.addGroup(name, mockValidation, data);
    expect(Object.keys(gc.groups).length).toBe(1);
    expect(Object.keys(gc.validators).length).toBe(1);

    mockValidation.mockClear();
    gc.addGroup(name, mockValidation, data);
    expect(Object.keys(gc.groups).length).toBe(1);
    expect(mockValidation).toBeCalledTimes(0);
  });
});

describe("removeGroup", () => {
  const name = "test";
  const mockValidation = jest.fn(() => false);
  const data = {
    "1": { ref: "1", meta: { loaded: false, loadedAt: 0, updatedAt: 0 }, doc: {} },
  };

  beforeEach(() => {
    mockValidation.mockClear();
    gc.clear();
  });

  test("success", () => {
    gc.addGroup(name, mockValidation, data);
    expect(Object.keys(gc.groups).length).toBe(1);
    expect(Object.keys(gc.validators).length).toBe(1);

    const res = gc.removeGroup(name);
    expect(res).toBe(1);
    expect(Object.keys(gc.groups).length).toBe(0);
    expect(Object.keys(gc.validators).length).toBe(0);
  });

  test("success, no group", () => {
    expect(Object.keys(gc.groups).length).toBe(0);
    expect(Object.keys(gc.validators).length).toBe(0);

    const res = gc.removeGroup(name);
    expect(res).toBe(0);
    expect(Object.keys(gc.groups).length).toBe(0);
    expect(Object.keys(gc.validators).length).toBe(0);
  });
});

describe("onNewDoc", () => {
  const name = "test";
  const mockValidation = jest.fn((doc) => doc.ref === "1");
  const doc = { ref: "1" };

  beforeEach(() => {
    mockValidation.mockClear();
    gc.clear();
  });

  test("success", () => {
    gc.addGroup(name, mockValidation, {});
    gc.onNewDoc(doc);
    expect(gc.groups[name].length).toBe(1);
    expect(mockValidation).toBeCalledTimes(1);
  });

  test("no match", () => {
    mockValidation.mockImplementationOnce((_doc) => false);
    gc.addGroup(name, mockValidation, {});
    gc.onNewDoc(doc);
    expect(gc.groups[name].length).toBe(0);
    expect(mockValidation).toBeCalledTimes(1);
  });

  test("fail", () => {
    mockValidation.mockImplementationOnce((_doc) => false);
    gc.addGroup(name, mockValidation, {});
    delete gc.validators[name];

    gc.onNewDoc(doc);
    expect(gc.groups[name]).toBeUndefined();
    expect(mockValidation).toBeCalledTimes(0);
  });
});

describe("onUpdatedDoc", () => {
  const name = "test";
  const mockValidation = jest.fn((doc) => doc.value === "1");
  const doc = { ref: "1", value: "1" };

  beforeEach(() => {
    mockValidation.mockClear();
    gc.clear();
  });

  test("mismatched refs", () => {
    gc.addGroup(name, mockValidation, {});

    expect(gc.groups[name].length).toBe(0);

    gc.onUpdatedDoc(doc, { ref:"2"});

    expect(mockValidation).toBeCalledTimes(0);
    expect(gc.groups[name].length).toBe(0);
  });

  test("no change", () => {
    gc.addGroup(name, mockValidation, {});

    expect(gc.groups[name].length).toBe(0);

    gc.onUpdatedDoc(doc, doc);

    expect(mockValidation).toBeCalledTimes(2);
    expect(gc.groups[name].length).toBe(0);
  });

  test("adding", () => {
    gc.addGroup(name, mockValidation, {});

    expect(gc.groups[name].length).toBe(0);

    gc.onUpdatedDoc(doc, { ref: "1", value: "2" });

    expect(mockValidation).toBeCalledTimes(2);
    expect(gc.groups[name].length).toBe(1);
  });

  test("removing", () => {
    gc.addGroup(name, mockValidation, {});
    gc.onNewDoc(doc);
    mockValidation.mockClear();

    expect(gc.groups[name].length).toBe(1);

    gc.onUpdatedDoc({ ref: "1", value: "2" }, doc);

    expect(mockValidation).toBeCalledTimes(2);
    expect(gc.groups[name].length).toBe(0);
  });

  test("fail", () => {
    mockValidation.mockImplementationOnce((_doc) => false);
    gc.addGroup(name, mockValidation, {});
    delete gc.validators[name];

    gc.onUpdatedDoc(doc, doc);
    expect(gc.groups[name]).toBeUndefined();
    expect(mockValidation).toBeCalledTimes(0);
  });
});

describe("onDeletedDoc", () => {
  const name = "test";
  const mockValidation = jest.fn((doc) => doc.value === "1");
  const doc = { ref: "1", value: "1" };

  beforeEach(() => {
    mockValidation.mockClear();
    gc.clear();
  });

  test("delete", () => {
    gc.addGroup(name, mockValidation, {});
    gc.onNewDoc(doc);
    mockValidation.mockClear();

    expect(gc.groups[name].length).toBe(1);

    gc.onRemoveDoc(doc);
    expect(gc.groups[name].length).toBe(0);
    expect(mockValidation).toBeCalledTimes(1);
  });

  test("delete but no doc", () => {
    gc.addGroup(name, mockValidation, {});

    expect(gc.groups[name].length).toBe(0);

    gc.onRemoveDoc(doc);
    expect(gc.groups[name].length).toBe(0);
    expect(mockValidation).toBeCalledTimes(1);
  });

  test("no delete", () => {
    gc.addGroup(name, mockValidation, {});
    gc.onNewDoc(doc);
    mockValidation.mockClear();

    expect(gc.groups[name].length).toBe(1);

    gc.onRemoveDoc({ ref: "1", value: "2"});
    expect(gc.groups[name].length).toBe(1);
    expect(mockValidation).toBeCalledTimes(1);
  });

  test("fail", () => {
    mockValidation.mockImplementationOnce((_doc) => false);
    gc.addGroup(name, mockValidation, {});
    delete gc.validators[name];

    gc.onRemoveDoc(doc);
    expect(gc.groups[name]).toBeUndefined();
    expect(mockValidation).toBeCalledTimes(0);
  });
});
