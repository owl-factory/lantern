import { buildWorkerPromise } from "features/webWorker/utils/promises";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

describe("buildWorkerPromise tests", () => {
  beforeEach(() => {
    jest.mocked(setTimeout).mockClear();
  });

  it("builds correctly", async () => {
    const timeout = 1500;
    const promiseReference = buildWorkerPromise("test", timeout, () => {});
    expect(promiseReference.resolve).toBeDefined();
    expect(promiseReference.reject).toBeDefined();
    expect(promiseReference.timeout).toBeDefined();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), timeout);
  });

  it("doesn't run a timeout", async () => {
    const timeout = 0;
    const promiseReference = buildWorkerPromise("test", timeout, () => {});
    expect(promiseReference.resolve).toBeDefined();
    expect(promiseReference.reject).toBeDefined();
    expect(promiseReference.timeout).toBeUndefined();

    expect(setTimeout).toHaveBeenCalledTimes(0);
  });
});
