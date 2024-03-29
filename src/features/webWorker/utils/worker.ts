import { WORKER_ENVIRONMENTS } from "features/webWorker/data/environments";
import { WorkerEnvironment } from "features/webWorker/types/environments";
import { WorkerScript } from "features/webWorker/types/worker";
import { WebWorkerState } from "features/webWorker/utils/controller";
import { workerFoundation } from "features/webWorker/utils/environments/foundation";
import { Err, ErrUnknown, Ok } from "utils/results";

/**
 * A specific error for buildWorker() that describes the error and
 * the appropriate WebWorker controller state for it
 */
export type BuildWorkerError = {
  state: WebWorkerState;
  error: string;
};

/**
 * Builds a worker with a specific environment and custom script to run
 * @param workerEnvironment - The type of environment this worker will use, such as a Sandboxed environment
 * @param handleMessageScript - The primary script to run within the worker, triggering at onmessage events
 * @returns A Result containing the created Worker, or an error object with the reason type and error message
 */
export function buildWorker<T, U, V>(
  workerEnvironment: WorkerEnvironment,
  handleMessageScript: WorkerScript<T, U, V>
): Result<Worker, BuildWorkerError> {
  const fullWorkerScriptResult = buildWorkerScript(workerEnvironment, handleMessageScript);
  if (fullWorkerScriptResult.ok === false) {
    return Err({ state: WebWorkerState.InvalidScript, error: fullWorkerScriptResult.error });
  }

  const fullWorkerScript = fullWorkerScriptResult.data;
  const url = scriptToUrl(fullWorkerScript);
  const workerResult = newSafeWorker(url);
  if (workerResult.ok === false) {
    return Err({ state: WebWorkerState.FailedToCreate, error: workerResult.error });
  }

  return workerResult;
}

/**
 * Builds the string version of the functionality to use within a Web Worker
 * @param workerEnvironment - The type of environment this worker will use, such as a Sandboxed environment
 * @param handleMessageScript - The primary script to run within the worker, triggering at onmessage events
 * @returns A Result containing the worker script, or an error
 */
function buildWorkerScript<T, U, V>(
  workerEnvironment: WorkerEnvironment,
  handleMessageScript: WorkerScript<T, U, V>
): Result<string> {
  const environment = WORKER_ENVIRONMENTS.get(workerEnvironment);
  if (!environment) return Err("Invalid environment provided");

  const handleMessage = handleMessageToString(handleMessageScript);
  const combinedScripts = combineScripts(handleMessage, environment);
  const workerScript = injectWorkerFunction(workerFoundation, combinedScripts);
  return Ok(workerScript);
}

/**
 * Converts the handleMessage script into a string for injection into a Web Worker script
 * @param handleMessageScript - The script to use for self.handleMessage
 * @returns A string containing the function to run at self.handleMessage
 */
function handleMessageToString<T, U, V>(handleMessageScript: WorkerScript<T, U, V>): string {
  return `self.handleMessage = ${handleMessageScript.toString()}`;
}

/**
 * Combines multiple scripts into a single string to inject
 * @param scripts - The list of scripts to combine together. More important scripts should be at the end
 * @returns A string of the combined scripts
 */
function combineScripts(...scripts: string[]) {
  return scripts.join("\n\n");
}

/**
 * Injects custom scripts into a worker script
 * @param workerScript - The workerScript string to inject a custom script into
 * @param combinedScripts - The custom script to inject into the worker script
 * @returns A full string to be used within a Web Worker
 */
function injectWorkerFunction(workerScript: string, combinedScripts: string) {
  return workerScript.replace(`"%injectTarget%";`, combinedScripts);
}

/**
 * Takes a function as a string and converts it into a URL.
 * @param workerScript - The worker script to convert into a URL. Must be a stringified function
 * @returns A result containing a script URL
 */
function scriptToUrl(workerScript: string): string {
  const blob = new Blob([`(${workerScript})()`]);
  const url = URL.createObjectURL(blob);
  return url;
}

/**
 * Safely creates a new web worker, catching any errors and safely
 *  packing them into results
 * @param url - The URL pointing to the script for the web worker
 * @returns A Result wrapping a Web Worker
 */
function newSafeWorker(url: string): Result<Worker> {
  try {
    const worker = new Worker(url);
    return Ok(worker);
  } catch (why) {
    return ErrUnknown(why);
  }
}

export const __testing__ = {
  buildWorkerScript,
  combineScripts,
  handleMessageToString,
  injectWorkerFunction,
  newSafeWorker,
  scriptToUrl,
};
