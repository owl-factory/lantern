import { Scalar } from "types";
import { ActorContent } from "types/documents/Actor";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";

export type SandboxWorkerMessage = StaticSandboxWorkerMessage & Record<string, Scalar | unknown>;

export interface StaticSandboxWorkerMessage {
  expr: string;
  actor: Record<string, Scalar>;
  rules: Record<string, StaticVariable>;
  content: Record<string, ActorContent[]>;
}
