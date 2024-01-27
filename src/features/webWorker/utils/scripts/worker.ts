import { WorkerMessage } from "features/webWorker/types/worker";

const coreFunctionality = () => {
  "initFn";
  const _init = () => {
    if ("init" in self && typeof self.init === "function") {
      self.init();
    }
  };

  self.onmessage = (message) => {
    console.log("From the worker!");
    postMessage({ id: message.data.id, ok: true, data: "res" });
  };
  _init();
};

const testInit = () => {
  console.log("WHATS UP");
};

export function createSandboxedWorker(): string {
  const initCode = "self.init = " + testInit.toString();
  let coreCode = coreFunctionality.toString();
  coreCode = coreCode.replace('"initFn";', initCode);
  console.log(coreCode);
  return coreCode;
}

export const test2 = () => {
  self.onmessage = (message) => {
    console.log("awsdasd");
    postMessage({ id: message.data.id, ok: true, data: "Howdy y'all!" });
  };
};

// export function createSandboxedWorker<T, U, V = string>(
//   _onMessage: WorkerOnMessageCallback<T, U, V>
// ): () => void {
//   return () => {
//     self.onmessage = () => {
//       postMessage("Howdy y'all!");
//     };
//   };
// }

self.onmessage = (messageEvent: MessageEvent<WorkerMessage<never, unknown>>) => {
  const message = messageEvent.data;
  const id = message.id;
  let result: WorkerResult<unknown>;
  try {
    result = { id, ok: true, data: undefined } as OkWorkerResult<unknown>;
  } catch (unknownWhy: unknown) {
    let why = "An unknown error occured. The thrown error was not either a string or Error.";
    if (typeof unknownWhy === "string") why = unknownWhy;
    else if (unknownWhy instanceof Error) why = unknownWhy.message;

    result = {
      id,
      ok: false,
      error: why,
    } as ErrWorkerResult;
  }
  postMessage(result);
};
