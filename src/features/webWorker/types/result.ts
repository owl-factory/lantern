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
