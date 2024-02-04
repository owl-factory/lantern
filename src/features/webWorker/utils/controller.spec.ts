import { WorkerEnvironment } from "features/webWorker/types/environments";
import { WebWorker, WebWorkerState } from "./controller";
import { buildWorker } from "./worker";
import { Err } from "utils/results";
import { PromiseReference } from "features/webWorker/types/promises";
import { WorkerResult } from "features/webWorker/types/result";

jest.mock("utils/environment", () => ({
  isServer: false,
}));

jest.mock("./promises");
jest.mock("./worker");

jest.useFakeTimers();
jest.spyOn(global, "clearTimeout");

const mockHandleMessage = () => {};

describe("WebWorker contructor", () => {
  beforeEach(() => {
    jest.mocked(buildWorker).mockClear();
  });

  test("constructs successfully", () => {
    const worker = new WebWorker(WorkerEnvironment.Sandbox, mockHandleMessage, 0);
    expect(buildWorker).toHaveBeenCalled();
    expect(worker._state).toBe(WebWorkerState.Ready);
  });

  test("building worker fails", () => {
    const mockState = WebWorkerState.InvalidScript;
    jest.mocked(buildWorker).mockImplementationOnce(() => Err({ state: mockState, error: "" }));

    const worker = new WebWorker(WorkerEnvironment.Sandbox, mockHandleMessage, 0);

    expect(buildWorker).toHaveBeenCalled();
    expect(worker._state).toBe(mockState);
  });
});

describe("WebWorker - attempt reload", () => {
  let worker: WebWorker<never, never, void>;
  beforeEach(() => {
    worker = new WebWorker(WorkerEnvironment.Sandbox, mockHandleMessage, 0);
    jest.mocked(buildWorker).mockClear();
  });

  test("successful reload", () => {
    worker._state = WebWorkerState.CreatedOnServer;
    worker.attemptReload();
    expect(worker._state).toBe(WebWorkerState.Ready);
    expect(buildWorker).toHaveBeenCalled();
  });

  test("reload does nothing", () => {
    worker._state = WebWorkerState.NoOp;
    worker.attemptReload();
    expect(worker._state).toBe(WebWorkerState.NoOp);
    expect(buildWorker).not.toHaveBeenCalled();
  });
});

describe("WebWorker - post", () => {
  let worker: WebWorker<string, undefined, void>;
  beforeEach(() => {
    worker = new WebWorker(WorkerEnvironment.Sandbox, mockHandleMessage, 0);
    jest.mocked(buildWorker).mockClear();
    worker._worker = { postMessage: jest.fn() } as unknown as Worker;
  });

  test("it creates a promise", async () => {
    worker.post("foo", undefined);
    expect(Object.keys(worker._promises).length).toBe(1);
  });

  test("worker is not ready", async () => {
    worker._state = WebWorkerState.NoOp;
    expect(async () => {
      await worker.post("foo", undefined);
    }).rejects.toContain("Web worker is not ready");
  });
});

describe("WebWorker - rejectOnTimeout", () => {
  let worker: WebWorker<string, undefined, void>;
  beforeEach(() => {
    worker = new WebWorker(WorkerEnvironment.Sandbox, mockHandleMessage, 0);
    jest.mocked(buildWorker).mockClear();
  });

  test("rejects promise", () => {
    const id = "abc";
    const reject = jest.fn();
    worker._promises[id] = {
      reject,
    } as unknown as PromiseReference<string, undefined, void>;

    worker._rejectOnTimeout(id);
    expect(reject).toHaveBeenCalled();
    expect(Object.keys(worker._promises).length).toBe(0);
  });

  test("promise already completed", () => {
    const id = "abc";

    worker._rejectOnTimeout(id);
    expect(Object.keys(worker._promises).length).toBe(0);
  });
});

describe("WebWorker - onMessage", () => {
  let worker: WebWorker<string, undefined, void>;
  beforeEach(() => {
    worker = new WebWorker(WorkerEnvironment.Sandbox, mockHandleMessage, 0);
    jest.mocked(buildWorker).mockClear();

    jest.mocked(clearTimeout).mockClear();
  });

  test("resolves promise", () => {
    const id = "abc";
    const resolve = jest.fn();
    const reject = jest.fn();
    worker._promises[id] = {
      resolve,
      reject,
    } as unknown as PromiseReference<string, undefined, void>;

    const mockMessage = { data: { id, ok: true } } as unknown as MessageEvent<WorkerResult<void>>;

    worker._onMessage(mockMessage);
    expect(resolve).toHaveBeenCalled();
    expect(Object.keys(worker._promises).length).toBe(0);
    expect(clearTimeout).toHaveBeenCalled();
  });

  test("resolves promise", () => {
    const id = "abc";
    const resolve = jest.fn();
    const reject = jest.fn();
    worker._promises[id] = {
      resolve,
      reject,
    } as unknown as PromiseReference<string, undefined, void>;

    const mockMessage = { data: { id, ok: false } } as unknown as MessageEvent<WorkerResult<void>>;

    worker._onMessage(mockMessage);
    expect(reject).toHaveBeenCalled();
    expect(Object.keys(worker._promises).length).toBe(0);
    expect(clearTimeout).toHaveBeenCalled();
  });

  test("promise not found", () => {
    const id = "abc";

    worker._onMessage({ data: { id } } as unknown as MessageEvent<WorkerResult<void>>);
    expect(Object.keys(worker._promises).length).toBe(0);
    expect(clearTimeout).not.toHaveBeenCalled();
  });
});
