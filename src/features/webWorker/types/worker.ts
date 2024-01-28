/**
 * The custom function that contains all functionality for a web worker
 * @typeParam T - The different possible actions the script can take
 * @typeParam U - The data sent to the worker
 * @typeParam V - The data received from the worker
 */
export type WorkerScript<T, U, V> = (message: WorkerMessage<T, U>) => WorkerResult<V>;

/** A standard message object to a worker */
export type WorkerMessage<T, U> = {
  id: string;
  type: T;
  data: U;
};

/** A standard result sent from a web worker. */
export type WorkerResult<V> = OkWorkerResult<V> | ErrWorkerResult;

/** A successful result sent from a web worker */
export type OkWorkerResult<V> = {
  id: string;
  ok: true;
  data: V;
};

/** A statnded fail result from a web worker */
export type ErrWorkerResult = {
  id: string;
  ok: false;
  error: string;
};

/** The different environments to use for a given worker */
export enum WorkerFoundation {
  /** Puts the worker into a restricted sandbox mode for user-provided code */
  Sandbox,
}
