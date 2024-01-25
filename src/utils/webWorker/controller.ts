import { isServer } from "utils/environment";

type Milliseconds = number;

/**
 * Either a function to use as a script, or points to
 * a compiled script to fetch and use
 */
type WorkerScript = () => void | string;

type WorkerResult<U> = OkWorkerResult<U> | ErrWorkerResult;

type OkWorkerResult<U> = {
  id: string;
  ok: true;
  data: U;
};

type ErrWorkerResult = {
  id: string;
  ok: false;
  error: string;
};

type PromiseReference<T, U> = {
  id: string;
  data: T;
  promise: Promise<U>;
  resolve: (value: U) => void;
  reject: (error: string) => void;
};

export class WebWorker<T, U> {
  _state: WebWorkerState = WebWorkerState.NoOp;
  _error?: string;

  _promises: Record<string, PromiseReference<T, U>> = {};
  _timeout: Milliseconds;
  _workerScript: WorkerScript;
  _worker!: Worker;

  constructor(workerScript: WorkerScript, timeout: Milliseconds) {
    this._workerScript = workerScript;
    this._timeout = timeout;

    this._loadWorker();
  }

  /**
   * Sets a new state and optional error message
   * @param state - The new state
   * @param error - The error message to accompany the state, if any
   */
  _setState(state: WebWorkerState, error?: string) {
    this._state = state;
    this._error = error;
  }

  /**
   * Checks if the Web Worker is ready
   */
  get ready() {
    return this._state === WebWorkerState.Ready;
  }

  /**
   * Attempts to recreate the web worker, if it was attempted to be made on a server
   */
  attemptReload() {
    if (this._state !== WebWorkerState.OnServer) return;
    this._loadWorker();
  }

  /**
   * Loads a worker from the stored script
   */
  _loadWorker() {
    if (isServer) {
      this._setState(
        WebWorkerState.OnServer,
        "Could not load the web worker due to being on the server"
      );
      return;
    }

    // TODO - move this into a helper function
    const typeOfScript = typeof this._workerScript;
    let url: string;
    switch (typeOfScript) {
      case "string":
        this._setState(
          WebWorkerState.NotImplemented,
          "Loading a web worker via a script string is not implemented"
        );
        return;
      case "function": {
        const code = this._workerScript.toString();
        const blob = new Blob([`(${code})`]);
        url = URL.createObjectURL(blob);
        break;
      }

      default:
        this._setState(
          WebWorkerState.InvalidScript,
          "The provided script was not a URL or a function"
        );
        return;
    }

    let worker: Worker;
    try {
      worker = new Worker(url);
    } catch (why: unknown) {
      this._setState(WebWorkerState.FailedToCreate, `The web worker failed to create: ${why}`);
      return;
    }

    this._worker = worker;
  }

  /**
   * Posts a message to the web worker
   * @param data - The data to pass to the Web Worker
   * @returns A promise that will resolve when the web worker returns
   */
  async post(type: string, data: T): Promise<U> {
    if (!this.ready) {
      return new Promise((_, reject) => reject(`Web worker is not ready. ${this._error}`));
    }
    const id = crypto.randomUUID();
    const message = { id, type, data };
    const promiseReference: Partial<PromiseReference<T, U>> = { id, data };
    const promise = new Promise((resolve: (value: U) => void, reject: (reason: string) => void) => {
      this._worker.postMessage(message);
      promiseReference.resolve = resolve;
      promiseReference.reject = reject;

      if (this._timeout <= 0) return;
      setTimeout(() => {
        delete this._promises[id];
        reject(`Timeout reached (${this._timeout}ms).`);
      }, this._timeout);
    });
    promiseReference.promise = promise;

    this._promises[id] = promiseReference as PromiseReference<T, U>;
    return promise;
  }

  /**
   * We have two options:
   * 1. We keep a list of active promises, and resolve or reject for a given key
   * 2. Keys are initialized and their values stored, with Mobx tracking the values
   * Pros/cons of 1:
   *  - Small data footprint
   *  - Requires async/await or .then()
   *  - No values stored, so they must be recalculated for each instance of a thing
   * Pros/cons of 2:
   *  - Larger data footprint
   *  - No requirement of async/await
   *  - Values stored means we can limit refetching if the data hasn't changed
   *  - Values stored means we can share results across the same keys
   * Decision is to use 1. We can implement #2 on top of #1, but not vice versa
   */

  /**
   * Resolves or rejects the stored promise
   * @param message - The response from the web worker
   */
  _onMessage(message: WorkerResult<U>) {
    const promise = this._promises[message.id];
    delete this._promises[message.id];

    if (!promise) return;

    if (message.ok === false) {
      promise.reject(message.error);
      return;
    }
    promise.resolve(message.data);
  }
}

enum WebWorkerState {
  NoOp,
  Ready,

  OnServer,
  NotImplemented,
  FailedToCreate,
  InvalidScript,
}
