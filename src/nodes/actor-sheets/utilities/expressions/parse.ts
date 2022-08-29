import { ParsedExpression } from "types/expressions";

/**
 * Splits a string value up into expression
 * @param str The string potentially containing one or more expressions
 * @returns An array of string and Expression objects
 */
export function splitExpressionValue(str: string): ParsedExpression {
  const value: ParsedExpression = {
    value: str,
    hasExpression: hasExpression(str),
  };
  if (value.hasExpression) {
    value.variables = determineExpressionVariables(str);
  }

  return value;

}

/**
 * Determines if a string is an expression
 * @param str The string to evaluate
 */
export function hasExpression(str: string): boolean {
  return str.search(/^\$\{|[^\\]\$\{/) !== -1;
}

const EXPRESSION_CONTENT_REGEX = /\${(.+?)}/g;

// 1. Initial variable
// 2. Any additional variable components, either a dot reference or using brackets.
// eslint-disable-next-line max-len
const VARIABLE_REGEX = /([a-z_$][a-z0-9_$]+((\.[a-z_$][a-z0-9_$]+)|(\[(([0-9]+)|(\\?['"][a-z_$][a-z0-9_$]+\\?['"]))\]))*)/gi;

/**
 * Extracts out the names of variables accessed by expressions contained within the given string
 * @param str The string containing one or more expressions to extract the variables from
 * @returns An array containing the possible variable names
 */
function determineExpressionVariables(str: string) {
  const vars: string[] = [];

  const expressionContents = str.matchAll(EXPRESSION_CONTENT_REGEX);
  let content = expressionContents.next();
  while(!content.done) {
    const expressionVars = content.value[1].matchAll(VARIABLE_REGEX);
    let variable = expressionVars.next();
    while(!variable.done) {
      vars.push(variable.value[0]);
      variable = expressionVars.next();
    }
    content = expressionContents.next();
  }

  return vars;
}
