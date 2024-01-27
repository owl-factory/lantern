/** The custom function that contains all functionality for a web worker */
export type WorkerOnMessageCallback<T, U, V = string> = (
  message: WorkerMessage<T, V>
) => WorkerResult<U>;

/** A standard message object to a worker */
export type WorkerMessage<T, V = string> = {
  id: string;
  type: V;
  data: T;
};

/** A standard result sent from a web worker. */
export type WorkerResult<U> = OkWorkerResult<U> | ErrWorkerResult;

/** A successful result sent from a web worker */
export type OkWorkerResult<U> = {
  id: string;
  ok: true;
  data: U;
};

/** A statnded fail result from a web worker */
export type ErrWorkerResult = {
  id: string;
  ok: false;
  error: string;
};
