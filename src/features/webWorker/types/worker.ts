/**
 * The custom function that contains all functionality for a web worker
 * @typeParam T - The different possible actions the script can take
 * @typeParam U - The data sent to the worker
 * @typeParam V - The data received from the worker
 */
export type WorkerScript<T, U, V> = (type: T, data: U) => V;

/** A standard message object to a worker */
export type WorkerMessage<T, U> = {
  id: string;
  type: T;
  data: U;
};

/** The different environments to use for a given worker */
export enum WorkerEnvironment {
  /** Puts the worker into a restricted sandbox mode for user-provided code */
  Sandbox,
}
