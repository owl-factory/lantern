import { PromiseReference, Reject, Resolve } from "features/webWorker/types/promises";
import { Milliseconds } from "types/time";

/**
 * Builds a worker promise, generating a reference to be stored
 * @param timeoutAfter - The time in milliseconds to attempt this promise before aborting it
 * @param onTimeout - The function to run when a timeout occurs
 * @returns A reference to the promise to be stored within the Worker Controller
 */
export function buildWorkerPromise<T, U, V>(
  timeoutAfter: Milliseconds,
  onTimeout: (id: string) => void
): PromiseReference<T, U, V> {
  const id = crypto.randomUUID();

  const promiseReference: Partial<PromiseReference<T, U, V>> = {
    id,
  };

  const promise = new Promise((resolve: Resolve<V>, reject: Reject) => {
    promiseReference.resolve = resolve;
    promiseReference.reject = reject;

    if (timeoutAfter <= 0) return;
    promiseReference.timeout = setTimeout(() => {
      onTimeout(id);
    }, timeoutAfter);
  });

  promiseReference.promise = promise;

  return promiseReference as PromiseReference<T, U, V>;
}
