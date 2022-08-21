// Describes the object created from parsing out a string into chunks of plain strings and expression objects
export interface ParsedExpressionString {
  isExpression: boolean;
  value: string;
}
