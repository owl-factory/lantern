/**
 * Validates that the given string is a valid variable
 * @param str The string to validate
 */
export function validateVariable(str: string) {
  if (str.length === 0) { throw `A variable name cannot be empty`; }
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
