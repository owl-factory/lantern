import {
  ComputedExpression,
  ExpressionDescriptor,
  ExpressionType,
  PlainTextExpression,
} from "features/dynamicRender/types/expression";

/** Contains a matcher for an expression */
const EXPRESSION_REGEX = /[^\\]\${(.+)}/;
const VALID_VARIABLE_PREFIXES = ["character", "content", "ruleset", "campaign", "sheet", "local"];
const VARIABLE_REGEX = "";

export function parseTextIntoExpression(text: string): ExpressionDescriptor {
  if (!text || typeof text !== "string") return newPlainTextExpression("");

  const hasExpression = checkTextForExpression(text);
  if (!hasExpression) return newPlainTextExpression(text);

  const expressionContents = getExpressionContents(text);
  const variables = getAllUniqueVariables(expressionContents);
  const queries = buildAllQueries(variables);

  const computedExpression: ComputedExpression = {
    type: ExpressionType.Computed,
    queries,
  };
}

/**
 * Checks a given string if it contains an expression
 * @param text - The text to check for an expression
 * @returns True if an expression is found within the text
 */
function checkTextForExpression(text: string): boolean {
  if (typeof text !== "string") return false;
  return EXPRESSION_REGEX.test(text);
}

function checkExpressionForNestedExpression(expressionText: string): boolean {}

function getExpressionContents(text: string): string[] {
  if (typeof text !== "string") return [];
  // New regex because setting global flag makes this stateful
  const expressionRegex = RegExp(EXPRESSION_REGEX, "g");
  const capturingGroups: string[] = [];
  let regexResults: RegExpExecArray | null;
  while ((regexResults = expressionRegex.exec(text)) !== null) {
    if (regexResults.length < 2) continue;
    capturingGroups.push(regexResults[1]);
  }
  return capturingGroups;
}

function getAllUniqueVariables(expressionContents: string[]): string[] {
  return expressionContents.map(getVariablesInSingleExpression).flat();
}

function getVariablesInSingleExpression(expressionContent: string): string[] {
  if (typeof expressionContent !== "string") return [];
}

/**
 * Creates a new PlainText Expression Descriptor
 * @param text - The hardcoded text to insert into a new plain text expression
 * @returns An ExpressionDescriptor
 */
function newPlainTextExpression(text: string): ExpressionDescriptor {
  return {
    type: ExpressionType.PlainText,
    value: text,
  } as PlainTextExpression;
}
