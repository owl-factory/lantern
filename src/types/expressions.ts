// Describes a string that may contain an expression requiring evaluation
export interface ParsedExpression {
  hasExpression: boolean; // True if there is an expression within the string requiring evaluation
  value: string; // The raw text value of the string (potentially containing expressions)
  variables?: string[]; // The list of variables that the expression will attempt to access
}
