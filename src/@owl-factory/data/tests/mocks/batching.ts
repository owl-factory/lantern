import { Ref64 } from "@owl-factory/types";

export const mockBatchingController = {
  addToCacheQueue: jest.fn((_ref: Ref64) => { return; }),
  runCacheBatch: jest.fn(() => { return; }),
};
