import { Ref64 } from "@owl-factory/types";

class MockBatchingController {
  public addToCacheQueue = jest.fn((_ref: Ref64) => { return; });
  public runCacheBatch = jest.fn(() => { return; });
}

export const BatchingController = MockBatchingController;
