import { matchAll } from "utils/regex";

/** Regex for breaking a variable string into its constituent parts. Eg "self.name" to ["self", "name"] */
const VARIABLE_COMPONENT_REGEX = /([a-z$_][0-9a-z$_]*)[.[]?|(.+)\]/;

/**
 * Gets the
 */
export function getVariableComponents(text: string): string[] {
  if (typeof text !== "string") return [];
  const rawVariableComponentMatches = matchAll(VARIABLE_COMPONENT_REGEX, text, "i");
  const variableComponents = rawVariableComponentMatches
    .map(extractVariableComponentFromRegExpArray)
    .filter((value: string | undefined): value is string => value !== undefined);
  console.log(variableComponents);
  return [];
}

function extractVariableComponentFromRegExpArray(
  rawVariableComponentMatch: RegExpExecArray
): string | undefined {
  if (rawVariableComponentMatch.length === 0) return undefined;
  if (rawVariableComponentMatch[1]) return rawVariableComponentMatch[1];
  if (rawVariableComponentMatch[2]) return rawVariableComponentMatch[2];
  return undefined;
}
