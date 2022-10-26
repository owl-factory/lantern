import { Expression } from "nodes/view-renderer/types/expression";

/**
 * Parses a string to find any expressions and the variables used therein, determining if any extra
 * computation is needed to determine the value for rendering and any variable dependencies that are required, if any
 * @param str The string value to evaluate for any expression
 * @returns An expression object describing if a value is an expression and the variables it uses
 */
export function parseExpression(str: string | null): Expression {
  const value = str || "";
  const expr: Expression = {
    isExpression: isExpression(value),
    value,
  };

  if (expr.isExpression) {
    expr.variables = determineExpressionVariables(value);
  }

  return expr;
}

/**
 * Searches through a string using a regex to locate a '${' at the beginning of a string or a '${'
 * that is not preceeded by a backslash
 * @param str The string to search through
 * @returns True if a expression start is found, false otherwise
 */
export function isExpression(str: string) {
  return str.search(/^\$\{|[^\\]\$\{/) !== -1;
}

// Regex expression that grabs the contents from within the expression brackets '${}'
const EXPRESSION_CONTENT_REGEX = /\${(.+?)}/g;

// 1. Initial variable
// 2. Any additional variable components, either a dot reference or using brackets.
//                      1.                 2.
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
