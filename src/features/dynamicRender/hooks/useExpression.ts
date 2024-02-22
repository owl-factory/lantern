import { ExpressionDescriptor, ExpressionType } from "features/dynamicRender/types/expression";
import { useEffect, useMemo, useState } from "react";

/**
 * Evaluates an expression, processing it safely through a Web Worker,
 * and returning the result to be used.
 * This will safely handle the accidental use of a string instead of a proper
 * expression, though no evaluation will be done.
 * @param expression - The expression to evaluate
 * @returns A string value of the evaluated result
 */
export function useExpression(expression: ExpressionDescriptor | string): string {
  const initialValue = useMemo(() => getInitialValue(expression), [expression]);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (typeof expression !== "object") return;
    if (expression.type === ExpressionType.PlainText) return;
    setValue("TODO");
  });

  return value;
}

/**
 * Determines the initial value of a given expression
 * @param expression - The expression descriptor to evaluate for an initial value
 * @returns The initial value as a string. If undetermined, an empty string
 */
function getInitialValue(expression: ExpressionDescriptor | string) {
  if (typeof expression === "string") return expression;
  else if (typeof expression !== "object") return "";

  if (expression.type === ExpressionType.PlainText) return expression.value;
  return "";
}
