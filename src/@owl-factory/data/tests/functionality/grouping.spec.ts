import { GroupingController } from "@owl-factory/data/grouping";

describe("DataController Functions", () => {
  let grouping: GroupingController<Record<string, unknown>>;
  let doc1: Record<string, unknown>;
  let doc2: Record<string, unknown>;
  beforeEach(() => {
    grouping = new GroupingController();
    doc1 = { ref: "1" };
    doc2 = { ref: "2" };
  });

  // TODO - add tests. Seriously
});
