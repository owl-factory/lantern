import { Expression, ExpressionVariable } from "../../expression";

// Describes the attributes of a loop element
export interface LoopAttributes {
  key: string;
  delimiter: string;
  index: string | null;
  listSource?: ExpressionVariable;
  listSourceExpression?: Expression;
  list?: string[];
}
