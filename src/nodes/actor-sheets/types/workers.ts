import { Scalar } from "types";
import { ActorContent } from "types/documents/Actor";
import { StaticVariableValue } from "types/documents/subdocument/StaticVariable";

// The contents of the message data to the actor sheet sandboxed web worker
export type SandboxWorkerMessage = StaticSandboxWorkerMessage & Record<string, Scalar | unknown>;

// The constant and required values of message data sent to the actor sheet sandboxed web worker
export interface StaticSandboxWorkerMessage {
  expr: string;
  actor: Record<string, Scalar>;
  rules: Record<string, StaticVariableValue>;
  content: Record<string, ActorContent[]>;
}
