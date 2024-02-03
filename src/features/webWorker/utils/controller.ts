import { PromiseReference } from "features/webWorker/types/promises";
import { WorkerResult } from "features/webWorker/types/result";
import { WorkerEnvironment, WorkerMessage, WorkerScript } from "features/webWorker/types/worker";
import { buildWorkerPromise } from "features/webWorker/utils/promises";
import { buildWorker } from "features/webWorker/utils/worker";
import { Milliseconds } from "types/time";
import { isServer } from "utils/environment";

/**
 * A controller that creates a web worker and maintains calls to and from it
 * @typeParam T - A key used to identify the action to take within the web worker
 * @typeParam U - The data posted to the web worker
 * @typeParam V - The data received from the web worker
 */
export class WebWorker<T, U, V> {
  /** The state of this controller */
  _state: WebWorkerState = WebWorkerState.NoOp;
  /** The error message associated with the state, if any */
  _error?: string;

  /** The record of promises currently pending */
  _promises: Record<string, PromiseReference<T, U, V>> = {};
  /** The duration of time that should pass before a promise times out */
  _timeout: Milliseconds;

  /** The specific environment we are loading into the worker */
  _environment: WorkerEnvironment;
  /** The script that will be injected into a web worker. */
  _workerScript: WorkerScript<T, U, V>;
  /** The web worker created containing the given worker script */
  _worker!: Worker;

  constructor(
    workerEnvironment: WorkerEnvironment,
    workerScript: WorkerScript<T, U, V>,
    timeout: Milliseconds
  ) {
    this._environment = workerEnvironment;
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
      this._setState(WebWorkerState.OnServer, workerError[WebWorkerState.OnServer]);
      return;
    }

    const workerResult = buildWorker(this._environment, this._workerScript);
    if (workerResult.ok === false) {
      this._setState(workerResult.error.state, workerResult.error.error);
      return;
    }

    this._worker = workerResult.data;
    this._worker.onmessage = (event: MessageEvent<WorkerResult<V>>) => this._onMessage(event);
    this._worker.onerror = (err) => console.log("err", err);
    this._worker.onmessageerror = (err) => console.log("Message err", err);
    this._setState(WebWorkerState.Ready);
  }

  /**
   * Posts a message to the web worker
   * @param data - The data to pass to the Web Worker
   * @returns A promise that will resolve when the web worker returns
   */
  async post(type: T, data: U): Promise<V> {
    if (!this.ready) {
      return new Promise((_, reject) =>
        reject(`Web worker is not ready. Error ${this._state}: ${this._error}`)
      );
    }

    const promise = buildWorkerPromise<T, U, V>(this._timeout, (id: string) =>
      this._rejectOnTimeout(id)
    );

    const message: WorkerMessage<T, U> = { id: promise.id, type, data };
    this._worker.postMessage(message);
    this._promises[promise.id] = promise;

    return promise.promise;
  }

  /**
   * The functionality to run when a promise rejects due to a timeout
   * @param id - The ID of the promise to reject
   */
  _rejectOnTimeout(id: string) {
    const promise = this._promises[id];
    if (!promise) return;
    delete this._promises[id];
    promise.reject(`Timeout reached (${this._timeout}ms).`);
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
  _onMessage(messageEvent: MessageEvent<WorkerResult<V>>) {
    const message = messageEvent.data;
    const promise = this._promises[message.id];
    delete this._promises[message.id];

    if (!promise) return;
    clearTimeout(promise.timeout);

    if (message.ok === false) {
      promise.reject(message.error);
      return;
    }

    promise.resolve(message.data);
  }
}

/** The valid states the Web Worker controller can be in */
export enum WebWorkerState {
  /** No operation has been performed on the controller */
  NoOp,
  /** The controller is ready to be used */
  Ready,

  /** The controller has been created on the server and could not create a web worker */
  OnServer,
  /** Some functionality is not implemented */
  NotImplemented,
  /** The controller failed to create a worker */
  FailedToCreate,
  /** The provided script is not valid */
  InvalidScript,
}

/** Contains errors or functions to build an error */
const workerError = {
  [WebWorkerState.OnServer]: "Could not load the web worker due to being on the server",
  [WebWorkerState.NotImplemented]: "Loading a web worker via a script string is not implemented",
  [WebWorkerState.InvalidScript]: "The provided script was not a URL or a function",
};
