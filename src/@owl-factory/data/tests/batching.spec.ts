import { BatchingController } from "@owl-factory/data/batching";

describe("BatchingController Functions", () => {
  let batching: BatchingController;
  let hasMockRun: boolean;

  function mockCacheAction() {
    hasMockRun = true;
  }

  beforeEach(() => {
    hasMockRun = false;
    batching = new BatchingController(mockCacheAction, 100);
  });

  test("addToCacheQueue success", () => {
    expect(Object.keys(batching.cacheQueue).length).toBe(0);

    batching.addToCacheQueue("1");
    expect(Object.keys(batching.cacheQueue).length).toBe(1);
  });

  test("addToCacheQueue no overlap for multiple", () => {
    expect(Object.keys(batching.cacheQueue).length).toBe(0);

    batching.addToCacheQueue("1");
    expect(Object.keys(batching.cacheQueue).length).toBe(1);
    batching.addToCacheQueue("1");
    expect(Object.keys(batching.cacheQueue).length).toBe(1);
  });
});
