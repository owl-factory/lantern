import { Expression } from "../../expression";

// Describes the attributes of a loop element
export interface LoopAttributes {
  className: Expression;
  key: string;
  delimiter: string;
  index: string | null;
  listSource?: string;
  list?: string[];
}
