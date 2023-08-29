import { isClient } from "utilities/client";
import { newWebWorker } from "../utilities";

// The base abstract class for requesting execution of web worker functionality through the use of promises
export abstract class PromiseWebWorker {
  protected promises: Record<string, any> = {};
  private worker!: Worker;
  constructor(workerFunction: () => void) {
    const worker = newWebWorker(workerFunction);
    if (isClient) {
      (worker as Worker).onmessage = (message: any) => this.onMessage(message);
      this.worker = worker as Worker;
    }
  }

  /**
   * Generates a unqiue ID to identify a promise
   * @param args The arguments used to generate a unique ID
   */
  protected abstract generateUniqueID(args?: Record<string, unknown>): string;

  /**
   * Posts a message to the web worker, creating a promise to resolve when the worker finishes calculating
   * @param args The arguments to send to the web worker
   * @returns A promise for a response from the web worker
   */
  protected post(args: Record<string, unknown>): Promise<unknown> {
    const id = this.generateUniqueID(args); // The unique ID for handling promises

    args.promiseID = id;
    this.promises[id] = {};
    this.promises[id].promise = new Promise((resolve, reject) => {
      // Breaks promise early if we know this won't succeed
      if (!this.worker) {
        reject("Sandbox Worker Exception: ");
        return;
      }

      this.worker.postMessage(args);
      // Saves data in the promise object for reference when we return it
      this.promises[id].resolve = resolve;
      this.promises[id].reject = reject;
      this.promises[id].args = args;
    });

    return this.promises[id].promise;
  }

  /**
   * Handles the response from the web worker
   * @param message The response from the web worker
   */
  protected onMessage(message: any): void {
    const data = message.data;
    const promise = this.promises[data.promiseID];

    delete this.promises[data.promiseID]; // Removes this from the list of promises

    if (!data.success) {
      promise.reject(data.message);
      return;
    }

    promise.resolve(data.values);
  }
}
