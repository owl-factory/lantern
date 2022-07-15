import { string } from "yup/lib/locale";

export interface ExpressionItem {
  type: ExpressionType;
  value?: string;
}

export interface Expression {
  items: ExpressionItem[];
}

const EXPRESSION_PART_REGEXES = [
  /(\$[a-zA-Z0-9][a-zA-Z0-9.]*[a-zA-Z0-9]?)/, // Variable name regex ($foo.bar)
];

export enum ExpressionType {
  Variable,
}

/**
 * Splits a string value up into expression
 * @param str The string potentially containing one or more expressions
 * @returns An array of string and Expression objects
 */
export function splitExpressionValue(str: string): (string | Expression)[] {
  const exprs: (string | Expression)[] = [];
  let currentString = str;
  let i = 0;
  while(true) {
    const nextExpressionIndex = getNextExpressionStart(currentString);
    // There are no further expressions, so escape out
    if (nextExpressionIndex === -1) {
      exprs.push(currentString);
      break;
    }
    else if (nextExpressionIndex > 0) {
      exprs.push(currentString.substring(0, nextExpressionIndex));
      currentString = currentString.substring(nextExpressionIndex);
    }
    const nextExpressionEnd = getNextExpressionEnd(currentString);
    const expressionString = currentString.substring(0, nextExpressionEnd + 1);
    currentString = currentString.substring(nextExpressionEnd + 1);

    exprs.push(parseExpression(expressionString));

    // Safety net. If something breaks this prevents an infinite loop
    i++; if (i>1000) { break; }
  }

  return exprs;
}

/**
 * Gets the starting index of the next expression in the given string. Returns -1 if none is found
 * @param str The string to grab the start position of the next expression
 */
function getNextExpressionStart(str: string): number {
  // Detects expressions of the pattern '{...}'. Backslashes escape the expression start and end
  const expressionRegex = /(^{|[^\\]{).+?([^\\]})/;

  const index = str.search(expressionRegex);
  // Not found
  if (index === -1) { return index; }
  // The single curly brace regex causes an extra character to be counted at the beginning
  // If greater than zero is is always the case
  else if (index > 0) { return index + 1; }
  // Handles the case of zero where there could be a curly brace at the start or after one character
  else if (str[0] === '{') { return 0; }
  return index + 1;
}

/**
 * Gets the end index of the expression's end
 * @param str The string containing at least one full expression
 */
function getNextExpressionEnd(str: string): number {
  // Grabs an expression's end. Uses the pattern '{...}'. Backslashes escape the next curly brace
  const expressionEndRegex = /[^\\]}/;

  const index = str.search(expressionEndRegex);
  // Adds 1 since the search includes the preceeding character to ensure that a backslash does not escape the end
  return index + 1;
}

/**
 * Parses a string entirely composed of an expression into an Expression object
 * @param str The string containing an expression to parse
 */
function parseExpression(str: string): Expression {
  const expr: Expression = { items: [] };

  if (str[0] !== '{' || str[str.length - 1] !== '}') {
    console.error(`An improper expression was given in the 'parseExpression' function. Expression: '${str}'`);
    return expr;
  }

  // Removes the curly braces at the beginning and ends, as well as any padding spaces
  let currentString = str.substring(1, str.length - 1).trim();
  let i = 0;
  while(true) {
    if (currentString.length === 0) { break; }
    const nextExpressionType = getNextExpressionType(currentString);
    const nextExpressionEndIndex = getNextExpressionEndIndex(currentString, nextExpressionType);
    const expressionString = currentString.substring(0, nextExpressionEndIndex);
    // TODO - check that this doesn't break anything with an out-of-bounds index overflow
    currentString = currentString.substring(nextExpressionEndIndex);

    const exprItem = convertExpressionItemString(expressionString, nextExpressionType);
    expr.items.push(exprItem);

    if (++i > 1000) { break; }
  }
  return expr;
}

/**
 * Determines the next expression type within a given string
 * @param str The string containing one or more expression items
 */
function getNextExpressionType(str: string): ExpressionType {
  const firstChar = str[0];
  switch (firstChar) {
    case '$':
      return ExpressionType.Variable;
    default:
      throw "Invalid expression type";
  }
}

/**
 * Determines the index of the first character that is not the first expression
 * @param str The string containing one or more expression items
 * @param expressionType The type of the first expression in the string
 */
function getNextExpressionEndIndex(str: string, expressionType: ExpressionType) {
  switch (expressionType) {
    case ExpressionType.Variable:
      // Regex finds the next instance of a character not used in a variable or a $ not at the start of the string
      const variableEndIndex = str.search(/(?<!^)(\$|[^a-zA-Z0-9.])/);
      if (variableEndIndex === -1) { return str.length; }
      return variableEndIndex;
  }
}

/**
 * Converts a string and expression type into an expression item for easier parsing on render
 * @param str The string containing a single expression
 * @param expressionType The type of expression being converted
 */
function convertExpressionItemString(str: string, expressionType: ExpressionType): ExpressionItem {
  switch (expressionType) {
    case ExpressionType.Variable:
      const variableExpressionItem: ExpressionItem = {
        type: expressionType,
        value: str.substring(1), // Substring 1 is to remove the '$' indicating a variable
      };
      return variableExpressionItem;
  }
}
