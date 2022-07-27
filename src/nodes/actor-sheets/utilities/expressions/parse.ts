import { ParsedExpressionString } from "nodes/actor-sheets/types/expressions";

/**
 * Splits a string value up into expression
 * @param str The string potentially containing one or more expressions
 * @returns An array of string and Expression objects
 */
export function splitExpressionValue(str: string): ParsedExpressionString {
  const value: ParsedExpressionString = {
    value: str,
    isExpression: str.search(/^\$\{|[^\\]\$\{/) !== -1,
  };
  return value;

}

