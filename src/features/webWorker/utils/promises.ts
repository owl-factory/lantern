import { PromiseReference, Reject, Resolve } from "features/webWorker/types/promises";
import { Milliseconds } from "types/time";

export function buildWorkerPromise<T, U>(
  timeoutAfter: Milliseconds,
  onTimeout: (id: string) => void
): PromiseReference<T, U> {
  const id = crypto.randomUUID();

  const promiseReference: Partial<PromiseReference<T, U>> = {
    id,
  };

  const promise = new Promise((resolve: Resolve<U>, reject: Reject) => {
    promiseReference.resolve = resolve;
    promiseReference.reject = reject;

    if (timeoutAfter <= 0) return;
    promiseReference.timeout = setTimeout(() => {
      onTimeout(id);
    }, timeoutAfter);
  });

  promiseReference.promise = promise;

  return promiseReference as PromiseReference<T, U>;
}
