import { isExpression } from "../expressions/parse";

/**
 * Validates that the given string is in a valid format for accessing a variable
 * @param str The string to validate
 */
export function validateVariableAccess(str: string) {
  if (str.length === 0) { throw `A variable name cannot be empty`; }
  // We can't know if an expression is valid at parse time, so we ignore it
  if (isExpression(str)) { return; }
  const groups = str.split('.');
  for (const group of groups) {
    if (!isValidVariableName(group)) {
      // eslint-disable-next-line max-len
      throw `The name '${str}' is not a valid variable name. Variables must start with a letter and contain only letters, numbers, dashes, or underscores.`;
    }
  }
}

/**
 * Validates a variable declaration name to ensure that it is valid. Variables defined within the sheet must
 * not be nested and follow the ordinary rules for variable access
 * @param str The string containing the variable declaration to validate
 */
export function validateVariableDeclaration(str: string) {
  if (str.length === 0) { throw `A variable name cannot be empty`; }
  // We can't know if an expression is valid at parse time, so we ignore it
  if (isExpression(str)) { return; }
  if (!isValidVariableName(str)) {
    // eslint-disable-next-line max-len
    throw `The name '${str}' is not a valid variable name. Variables must start with a letter and contain only letters, numbers, dashes, or underscores.`;
  }
}

/**
 * Determines if the given string is a valid variable name
 * @param str The string to check the validity of
 */
function isValidVariableName(str: string): boolean {
  // Variable names must begin with a letter and contain only letters and numbers.
  return str.search(/^[a-zA-Z][a-zA-Z0-9-_]*?$/) === 0;
}
