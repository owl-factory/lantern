import "tests/globalUrlMock";
import { WorkerEnvironment } from "features/webWorker/types/environments";
import { BuildWorkerError, __testing__, buildWorker } from "./worker";
import { WorkerScript } from "features/webWorker/types/worker";
import { workerFoundation } from "features/webWorker/utils/environments/foundation";
import { WebWorkerState } from "features/webWorker/utils/controller";

const {
  buildWorkerScript,
  combineScripts,
  handleMessageToString,
  injectWorkerFunction,
  newSafeWorker,
  scriptToUrl,
} = __testing__;

const mockHandleMessage: WorkerScript<never, never, void> = () => {};

describe("buildWorker tests", () => {
  test("builds successfully", () => {
    const result = buildWorker(WorkerEnvironment.Sandbox, mockHandleMessage) as OkResult<Worker>;
    expect(result.ok).toBe(true);
  });

  test("build worker script fails", () => {
    const result = buildWorker(
      -1 as WorkerEnvironment,
      mockHandleMessage
    ) as ErrResult<BuildWorkerError>;
    expect(result.ok).toBe(false);
    expect(result.error.state).toBe(WebWorkerState.InvalidScript);
  });

  test("new worker fails", () => {
    jest.mocked(Worker).mockImplementationOnce(() => {
      // eslint-disable-next-line no-restricted-syntax
      throw "";
    });
    const result = buildWorker(
      WorkerEnvironment.Sandbox,
      mockHandleMessage
    ) as ErrResult<BuildWorkerError>;
    expect(result.ok).toBe(false);
    expect(result.error.state).toBe(WebWorkerState.FailedToCreate);
  });
});

describe("buildWorkerScript", () => {
  test("builds successfully", () => {
    const result = buildWorkerScript(
      WorkerEnvironment.Sandbox,
      mockHandleMessage
    ) as OkResult<string>;

    expect(result.ok).toBe(true);
    expect(typeof result.data).toBe("string");
  });

  test("missing environment", () => {
    const result = buildWorkerScript(-1 as WorkerEnvironment, mockHandleMessage);
    expect(result.ok).toBe(false);
  });
});

describe("combineScripts tests", () => {
  test("combines scripts", () => {
    const script = combineScripts("a", "b");
    expect(script).toContain("a");
    expect(script).toContain("b");
    expect(script.indexOf("a") < script.indexOf("b")).toBe(true);
  });
});

describe("handleMessageToString tests", () => {
  test("is successful", () => {
    const handleMessage = handleMessageToString(mockHandleMessage);
    expect(handleMessage).toContain("self.handleMessage = ");
    expect(handleMessage).toContain(mockHandleMessage.toString());
  });
});

describe("injectWorkerFunction tests", () => {
  test("injects worker function", () => {
    const target = `"%injectTarget%";`;
    expect(workerFoundation).toContain(target);
    const script = injectWorkerFunction(workerFoundation, mockHandleMessage.toString());

    expect(script).toContain(mockHandleMessage.toString());
    expect(script).not.toContain(target);
  });
});

describe("newSafeWorker tests", () => {
  test("is okay", () => {
    const workerResult = newSafeWorker("");
    expect(workerResult.ok).toBe(true);
  });

  test("is okay", () => {
    jest.mocked(Worker).mockImplementationOnce(() => {
      // eslint-disable-next-line no-restricted-syntax
      throw "";
    });
    const workerResult = newSafeWorker("");
    expect(workerResult.ok).toBe(false);
  });
});

describe("scriptToUrl tests", () => {
  beforeEach(() => {
    jest.mocked(URL.createObjectURL).mockClear();
  });

  test("it creates successfully", () => {
    const url = scriptToUrl(mockHandleMessage.toString());
    expect(url).toBe("");
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
