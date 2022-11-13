import { Expression, ExpressionVariable } from "../../expression";

// Describes the attributes of a loop element
export interface LoopAttributes {
  className: Expression;
  key: string;
  delimiter: string;
  index: string | null;
  listSource?: ExpressionVariable;
  list?: string[];
}
