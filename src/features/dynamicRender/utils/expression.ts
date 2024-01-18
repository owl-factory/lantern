/** Identifies an expression within a string. Matches `${...}` */
const EXPRESSION_IDENTIFIER = /\$\{(.+)\}/g;

export function containsExpression(text: string): boolean {
  return EXPRESSION_IDENTIFIER.test(text);
}

/**
 * Extracts the expression(s) from a string. Given `${abc}`, will return ["abc"].
 * @param text - The text to extract expressions from
 */
export function extractExpressions(text: string): string[] {
  const matches = text.matchAll(EXPRESSION_IDENTIFIER);
  console.log(matches);
  return [];
}

export function expressionToQuery(expression: string): GetQuery {
  const expressionComponents = extractExpressionComponents(expression);
}

/**
 * Test cases:
 * character.name
 * character.attributes.str
 * content.items[1].name
 * character["level"+index]
 */

function extractExpressionComponents(expression: string, depth = 0): string[] {
  if (depth > MAXIMUM_RECURSION_DEPTH) return [];

  const components: string[] = [];
  // TODO - really really break this down. Don't use regex (mostly), like parse through the string and break it down into its different components
  const matches = expression.match(VARIABLE_REGEX);
  for (const match of matches) {
    const hasSquareBrackets = match.includes("[");
    if (!hasSquareBrackets) {
      components.push(match);
      continue;
    }
  }
  return matches;
}

/** Regex that matches the variable format */
const VARIABLE_REGEX = /(([a-z0-9][a-z0-9.]*[a-z0-9]|\[.+\])+)/gi;

const MAXIMUM_RECURSION_DEPTH = 5;

export const __testing__ = {
  extractExpressionComponents,
};
