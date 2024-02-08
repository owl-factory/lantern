import { WorkerEnvironment } from "features/webWorker/types/environments";
import { sandboxEnvironment } from "features/webWorker/utils/environments/sandbox";

/** Defines the different environments a worker can have, such as a sandboxed environment for third-party code */
export const WORKER_ENVIRONMENTS = new Map([[WorkerEnvironment.Sandbox, sandboxEnvironment]]);
