import { WorkerMessage } from "features/webWorker/types/worker";

/** An extended version of the type for "self" */
type Self = Window & typeof globalThis & CustomSelfFunctions;

/** The custom functions added to the "self" variable */
type CustomSelfFunctions<T = unknown, U = unknown, V = unknown> = {
  init: () => void;
  handleMessage: (type: T, data: U) => V;
};

/** The foundation for all worker scripts */
const workerFoundation = () => {
  // Injections are at the top so that the below code will overwrite any shadowed functions
  "%injectTarget%";

  /**
   * Initializes the web worker. If an invalid script is provided or absent,
   * the worker will be locked and must be recreated
   */
  function $initializeWebWorker() {
    if (!$validateInit()) return;
    if (!$validateHandleMessage()) return;
    (self as Self).init();
  }

  /**
   * Validates that the init function is present. If not valid, locks the worker
   * @returns True for valid init, false otherwise
   */
  function $validateInit(): boolean {
    if ("init" in self && typeof self.init === "function") return true;
    self.onmessage = <T, U>(message: MessageEvent<WorkerMessage<T, U>>) => {
      postMessage({
        id: message.data.id,
        ok: false,
        error: "No initalization function was provided. This worker is locked and must be re-made.",
      });
    };
    return false;
  }

  /**
   * Validates that the handleMessage function is present. If not valid, locks the worker
   * @returns True for valid handleMessage, false otherwise
   */
  function $validateHandleMessage(): boolean {
    if ("handleMessage" in self && typeof self.handleMessage === "function") return true;
    self.onmessage = <T, U>(message: MessageEvent<WorkerMessage<T, U>>) => {
      postMessage({
        id: message.data.id,
        ok: false,
        error: "No handleMessage function was provided. This worker is locked and must be re-made.",
      });
    };
    return false;
  }

  /**
   * Runs at an onMessage event.
   * @param message - The Message Event containing a Worker Message
   */
  self.onmessage = async <T, U, V>(message: MessageEvent<WorkerMessage<T, U>>) => {
    try {
      const data = (self as Self).handleMessage(message.data.type, message.data.data) as V;
      postMessage({ id: message.data.id, ok: true, data });
    } catch (why: unknown) {
      const error = why instanceof Error ? why.message : (why as string);
      postMessage({ id: message.data.id, ok: false, error });
    }
  };
  $initializeWebWorker();
};

export function getWorkerFoundation() {
  return workerFoundation.toString();
}
