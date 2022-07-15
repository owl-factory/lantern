import { ExpressionType } from "../enums/expressionType";

// Describes the contents of an expression
export interface Expression {
  items: ExpressionItem[];
}

// Describes an item within an expression
export interface ExpressionItem {
  type: ExpressionType;
  value?: string;
}

// Describes the object created from parsing out a string into chunks of plain strings and expression objects
export interface ParsedExpressionString {
  isExpression: boolean;
  value: string;
}
