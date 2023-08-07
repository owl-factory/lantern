import { isServer } from "utilities/client";

/**
 * Creates a new worker from a supplied worker function. Client-side only.
 * @param worker The function code to place into a Web Worker
 * @returns A new Worker containing the supplied code
 */
export function newWebWorker(worker: () => void) {
  // NodeJS does not support Web Workers.
  if (isServer) { return null; }

  // Converts the function into a string and then blob to avoid loading in directly from a file
  const code = worker.toString();
  const blob = new Blob([`(${code})()`]);
  return new Worker(URL.createObjectURL(blob));
}

