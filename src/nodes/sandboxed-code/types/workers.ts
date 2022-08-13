import { WorkerAction } from "../enums/workerAction";

// The contents of the message data to the actor sheet sandboxed web worker
export type SandboxWorkerMessage = SandboxWorkerRenderMessage;

// The constant and required values of message data sent to the actor sheet sandboxed web worker
export interface SandboxWorkerRenderMessage extends BaseSandboxWorkerMessage {
  key: string;
  expression: string;
  properties: Record<string, unknown>;
}


// Describes the shared fields for any message to the Sandbox Web Worker
interface BaseSandboxWorkerMessage {
  action: WorkerAction; // The action the Sandboxed Web Worker will undertake
}

// The data contained within the response from the Sandboxed Web Worker
export interface MessageResponse {
  key: string;
  value: string;
}
