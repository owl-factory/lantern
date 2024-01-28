import { WorkerFoundation, WorkerScript } from "features/webWorker/types/worker";
import { sandboxInitialization } from "features/webWorker/utils/workerFoundations/sandbox";
import { Err, ErrUnknown, Ok } from "utils/results";

/**
 * Safely creates a new web worker, catching any errors and safely
 *  packing them into results
 * @param url - The URL pointing to the script for the web worker
 * @returns A Result wrapping a Web Worker
 */
export function newSafeWorker(url: string): Result<Worker> {
  try {
    const worker = new Worker(url);
    return Ok(worker);
  } catch (why) {
    return ErrUnknown(why);
  }
}

export function buildWorkerScript(
  foundationType: WorkerFoundation,
  script: WorkerScript | string
): Result<string> {
  const foundationScript = WORKER_FOUNDATIONS.get(foundationType);
  if (!foundationScript) return Err("Invalid script foundation provided");
  const rawFoundationScript = foundationScriptToString(foundationScript);
}

function foundationScriptToString(initScript: () => void) {
  return "self.init = " + initScript.toString();
}

const WORKER_FOUNDATIONS = new Map([[WorkerFoundation.Sandbox, sandboxInitialization]]);
