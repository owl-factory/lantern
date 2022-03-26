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
  
})
