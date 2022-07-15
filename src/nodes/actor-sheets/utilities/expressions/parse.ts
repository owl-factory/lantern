import { ExpressionType } from "nodes/actor-sheets/enums/expressionType";
import { Expression, ExpressionItem, ParsedExpressionString } from "nodes/actor-sheets/types/expressions";

const EXPRESSION_PART_REGEXES = [
  /(\$[a-zA-Z0-9-_][a-zA-Z0-9.]*[a-zA-Z0-9-_]?)/, // Variable name regex ($foo.bar)
];

interface ParsedExpression {
  type: ExpressionType;
  value?: string;
}

/**
 * 
 * @param str 
 * @returns 
 */
export function splitExpressionValue(str: string): ParsedExpressionString {
  const splitStrs: string[] = splitStringsAndExpressions(str.trim());
  const parsedStrings: ParsedExpressionString = [];
  for (const splitStr of splitStrs) {
    // If the string is too short for an expression, or doesn't start with an expression
    if (splitStr.length < 3 || splitStr[0] !== '$' || splitStr[1] !== '{') {
      parsedStrings.push(splitStr);
      continue;
    }
    const rawExprItems = parseExpressionString(splitStr);
    const exprItem = parseRawExpressionItems(rawExprItems);
    console.log(rawExprItems);
    parsedStrings.push();
  }

  return [];
}

function splitStringsAndExpressions(str: string): string[] {
  const splitStrs: string[] = [];
  const length = str.length;

  let ignoreNext = false;
  let lastStart = 0;
  let isExpression = false;
  for (let i = 0; i < length; i++) {
    // Ignores the next character. Set by backslashes
    if (ignoreNext) {
      ignoreNext = false;
      continue;
    }
    const char = str[i];
    switch(char) {
      case '\\':
        ignoreNext = true;
        continue;
      case '$':
        // Skips if this is the end of the string or if this is inside another expression
        if (i + 1 >= length || isExpression) { continue; }

        // Checks the next char to ensure this is an expression. If not, skip
        const nextChar = str[i + 1];
        if (nextChar !== '{') { continue; }

        // Saves the preceeding string
        if (lastStart !== i) {
          splitStrs.push(str.substring(lastStart, i));
          lastStart = i;
        }

        isExpression = true;
        continue;
      case '}':
        // Do nothing if this is not currently an expression
        if (!isExpression) { continue; }

        // Adds in the expression string
        splitStrs.push(str.substring(lastStart, i + 1));
        lastStart = i + 1;
        isExpression = false;
    }
  }

  // Handle case where the expression is unterminated
  if (isExpression) { throw `The expression in string '${str}' was not properly terminated`; }

  // Add in the last piece of string if not a expression
  const lastStr = str.substring(lastStart);
  if (lastStr.length) { splitStrs.push(str.substring(lastStart)); }

  return splitStrs;
}

function parseExpressionString(str: string): ParsedExpression[] {
  const exprItems: ParsedExpression[] = [];
  let exprStr = str.substring(2, str.length - 1).trim();

  let i = 0;
  while (exprStr.length > 0) {
    const nextExprType = getNextExpressionType(exprStr);
    const nextExprEnd = getNextExpressionEndIndex(exprStr, nextExprType);

    const exprItem: ParsedExpression = { type: nextExprType };
    if (
      nextExprType === ExpressionType.Variable ||
      nextExprType === ExpressionType.Function ||
      nextExprType === ExpressionType.Number
    ) {
      exprItem.value = exprStr.substring(0, nextExprEnd);
    }
    exprItems.push(exprItem);
    exprStr = exprStr.substring(nextExprEnd).trim();

    if (i++ > 1000) { throw "ParseStringExpression overloop"; }
  }

  return exprItems;
}

/**
 * Splits a string value up into expression
 * @param str The string potentially containing one or more expressions
 * @returns An array of string and Expression objects
 */
export function splitExpressionValue2(str: string): ParsedExpressionString {
  return [];
  const exprs: ParsedExpressionString = [];
  let currentString = str;
  let i = 0;
  while(true) {
    const nextExpressionIndex = getNextExpressionStart(currentString);
    // Prevents an empty string from being added to the end of the expression list
    if (currentString.length === 0) { break; }

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

  if (str[0] !== '$' || str[1] !== '{' || str[str.length - 1] !== '}') {
    console.error(`An improper expression was given in the 'parseExpression' function. Expression: '${str}'`);
    return expr;
  }

  // Removes the curly braces at the beginning and ends, as well as any padding spaces
  let currentString = str.substring(1, str.length - 1).trim();
  let i = 0;
  while(currentString.length > 0) {
    const nextExpressionType = getNextExpressionType(currentString);
    const nextExpressionEndIndex = getNextExpressionEndIndex(currentString, nextExpressionType);
    const expressionString = currentString.substring(0, nextExpressionEndIndex);

    // TODO - check that this doesn't break anything with an out-of-bounds index overflow
    currentString = currentString.substring(nextExpressionEndIndex).trim();

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
  const trimmedStr = str.trim();
  const firstChar = trimmedStr[0];
  switch (firstChar) {
    case '+':
      return ExpressionType.Add;
    case '-':
      return ExpressionType.Subtract;
    case '*':
      return ExpressionType.Multiply;
    case '/':
      return ExpressionType.Divide;
    case undefined:
      return ExpressionType.Invalid;
  }

  // Anything starting with a number is necessarily a number
  if (firstChar.search(/[0-9]/) === 0) { return ExpressionType.Number; }
  else if (str.search(/^[a-zA-Z][a-zA-Z0-9\-_]*(\.[a-zA-Z][a-zA-Z0-9\-_]*)*\(/) === 0) {
    return ExpressionType.Function;
  }
  else if (str.search(/^[a-zA-Z][a-zA-Z0-9\-_]*(\.[a-zA-Z][a-zA-Z0-9\-_]*)*/) === 0) { return ExpressionType.Variable; }

  return ExpressionType.Invalid;
}

/**
 * Determines the index of the first character that is not the first expression
 * @param str The string containing one or more expression items
 * @param expressionType The type of the first expression in the string
 */
function getNextExpressionEndIndex(str: string, expressionType: ExpressionType): number {
  switch (expressionType) {
    case ExpressionType.Add:
    case ExpressionType.Subtract:
    case ExpressionType.Multiply:
    case ExpressionType.Divide:
      return 1;
    case ExpressionType.Number:
      // Regex finds the next instance of a non-number character
      const numberEndIndex = str.search(/[^0-9]/);
      if (numberEndIndex === -1) { return str.length; }
      return numberEndIndex;

    case ExpressionType.Variable:
      // Regex finds the next instance of a character not used in a variable or a $ not at the start of the string
      const variableEndIndex = str.search(/(?<!^)(\$|[^a-zA-Z0-9.-_])/);
      if (variableEndIndex === -1) { return str.length; }
      return variableEndIndex;
  }
  return -1;
}

function parseRawExpressionItems(exprItems: ParsedExpression[]) {
  const rawExprItems = [...exprItems];
  
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
        value: str,
      };
      return variableExpressionItem;
    case ExpressionType.Invalid:
    default:
      // In the case of the invalid, print the string (or ignore it)
      const invalidExpressionItem: ExpressionItem = {
        type: expressionType,
        value: str,
      };
      return invalidExpressionItem;
  }
}
