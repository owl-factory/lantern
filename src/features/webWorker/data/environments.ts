import { WorkerEnvironment } from "features/webWorker/types/environments";
import { sandboxEnvironment } from "features/webWorker/utils/environments/sandbox";

export const WORKER_ENVIRONMENTS = new Map([[WorkerEnvironment.Sandbox, sandboxEnvironment]]);
