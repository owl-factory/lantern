import { isServer } from "@owl-factory/utilities/client";
import SandboxWorker from "./sandbox.worker";
import { SandboxWorkerMethods } from "./types";


export function newWorker(worker: () => void) {
  if (isServer) { return null; }
  const code = worker.toString();
  const blob = new Blob([`(${code})()`]);
  return new Worker(URL.createObjectURL(blob));
}

export function newSandboxWorker(arg: SandboxWorkerMethods) {
  const worker = SandboxWorker;
  worker.bind(arg.onmessage);
  return newWorker(worker);
}

