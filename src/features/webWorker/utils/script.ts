import { URL_REGEX } from "features/webWorker/data/regex";
import { WorkerScript } from "features/webWorker/types/worker";
import { Err, Ok } from "utils/results";

/**
 * Takes a script function, function string, or URL, then returns a URL of the code.
 * @param workerScript - The worker script to convert into a URL. May be a function, stringified function, or URL
 * @returns A result containing a script URL
 */
export function scriptToUrl<T, U, V>(workerScript: WorkerScript<T, U, V> | string): Result<string> {
  if (isUrl(workerScript)) {
    if (isValidUrl(workerScript)) {
      return Ok(workerScript as string);
    }
    return Err("Invalid URL provided for worker script");
  }

  const isFunction = typeof workerScript === "function";
  const code = isFunction ? workerScript.toString() : workerScript;
  const blob = new Blob([`(${code})()`]);
  const url = URL.createObjectURL(blob);
  return Ok(url);
}

function isUrl(workerScript: unknown): boolean {
  const isString = typeof workerScript === "string";
  if (!isString) return false;
  return URL_REGEX.test(workerScript);
}

function isValidUrl(workerScript: string | unknown): boolean {
  workerScript;
  return false;
}
