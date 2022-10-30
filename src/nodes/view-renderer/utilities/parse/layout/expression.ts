import { ExpressionVariableType } from "nodes/view-renderer/enums/expressionVariableType";
import { Expression, ExpressionVariable } from "nodes/view-renderer/types/expression";

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
    expr.variables = parseExpressionVariables(value);
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
 * Parses a string containing an expression, breaking out each variable into a code format that
 * will be easy to parse in the render stage
 * @param expressionString The raw string to be evaluated as an expression
 * @returns A breakdown of each variable used within the expression, how to call it,
 * and what type it is, organized into an array
 */
function parseExpressionVariables(expressionString: string): ExpressionVariable[] {
  const exprVariables: ExpressionVariable[] = [];
  const variables = extractVariables(expressionString);
  for (const variable in variables) {
    const exprVariable = parseExpressionVariable(variable);
    if (exprVariable) exprVariables.push(exprVariable);
  }
  return exprVariables;
}

/**
 * Extracts out the names of variables accessed by expressions contained within the given string
 * @param exprString The string containing one or more expressions to extract the variables from
 * @returns An array containing the possible variable names
 */
function extractVariables(exprString: string) {
  const variables: string[] = [];

  // Extracts the contents of the expressions
  const expressionContents = exprString.matchAll(EXPRESSION_CONTENT_REGEX);

  // Loops through each piece of content
  let content = expressionContents.next();
  while(!content.done) {

    // Grab anything that matches a variable and add it to the list
    const expressionVars = content.value[1].matchAll(VARIABLE_REGEX);
    let variable = expressionVars.next();
    while(!variable.done) {
      variables.push(variable.value[0]);
      variable = expressionVars.next();
    }
    content = expressionContents.next();
  }

  return variables;
}

/**
 * Parses a variable string into a format that can be easily read at runtime
 * @param variable The variable to parse into an expression variable usable by the code
 * @returns A parsed expression variable object, describing what kind of variable this is and how
 *  to fetch the value at runtime
 */
export function parseExpressionVariable(variable: string): ExpressionVariable | undefined {
  if (!variable) { return undefined; }

  const exprVariable: ExpressionVariable = {
    fullVariable: variable,
    type: ExpressionVariableType.Custom,
  };

  // Get first portion of the variable
  const firstAddress = variable.replace(/\..*/, "");

  switch (firstAddress) {
    // The value comes from the character sheet
    case "character":
      exprVariable.type = ExpressionVariableType.Actor;
      break;
    case "content":
      exprVariable.type = ExpressionVariableType.Content;
      break;
    // The value comes from plugins, campaign, or ruleset
    case "rules":
      exprVariable.type = ExpressionVariableType.Ruleset;
      break;
    // A value defined by the sheet
    case "sheet":
      exprVariable.type = ExpressionVariableType.Sheet;
      break;
    // A custom value in the properties defined by a loop
    default:
      return exprVariable;
  }

  // Removes the leading address from the string
  const remainderAddress = variable.replace(/^.+\./, "");

  // Removes everything after the initial field, if any
  const field = remainderAddress.replace(/\[.*|\..*/, "");
  const index = remainderAddress.replace(/^.*?\[/, "").replace(/\].*$/, "");
  const contentField = remainderAddress.replace(/(.*(\]|\.))|^.*?$/, "");

  exprVariable.field = field;
  if (index !== "" && !isNaN(parseInt(index))) { exprVariable.index = parseInt(index); }
  if (contentField !== "") { exprVariable.contentField = contentField; }

  return exprVariable;
}
