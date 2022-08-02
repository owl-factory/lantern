import { Scalar } from "types";
import { RenderGroup, SheetProperties } from ".";
import { DataSource } from "../enums/dataSource";
import { WorkerAction } from "../enums/workerAction";

// The contents of the message data to the actor sheet sandboxed web worker
export type SandboxWorkerMessage = SandboxWorkerRenderMessage | SandboxWorkerSetMessage;

// The constant and required values of message data sent to the actor sheet sandboxed web worker
export interface SandboxWorkerRenderMessage extends BaseSandboxWorkerMessage {
  key: string;
  expression: string;
  renderIDs: RenderGroup; //
  properties: SheetProperties;
}

// Describes what information should be present when setting a value in the Sandboxed Web Worker
export interface SandboxWorkerSetMessage extends BaseSandboxWorkerMessage {
  group: DataSource;
  id: string;
  value: unknown;
  key?: string;
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
