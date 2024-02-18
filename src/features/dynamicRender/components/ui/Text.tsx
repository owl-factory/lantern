import { ExpressionDescriptor, ExpressionType } from "features/dynamicRender/types/expression";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { useEffect, useState } from "react";

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps<TextAttributes>) {
  const textContent = useExpression(props.attributes.text);

  return <>{textContent}</>;
}

export const textBundle: RenderComponentDefinition = {
  Component: Text,
  nodeType: NodeType.Text,
  attributes: [],
  allowsChildren: false,
};

function useExpression(
  expression: ExpressionDescriptor | undefined,
  defaultValue: string | number = ""
) {
  const initialValue = getInitialExpressionValue(expression, defaultValue);
  const [value, setValue] = useState(initialValue);
  const dependencies = getExpressionDependencies(expression);

  useEffect(() => {
    if (!expression || expression.type === ExpressionType.PlainText) return;
    // const
  }, dependencies);

  return value;
}

/**
 * Determines the initial value of an expression
 * @param expression - The expression
 * @param defaultValue - The default value to use if no other initial value can be identified
 * @returns A string or number
 */
function getInitialExpressionValue(
  expression: ExpressionDescriptor | undefined,
  defaultValue: string | number = ""
): string | number {
  if (!expression) return defaultValue;
  if (expression.type === ExpressionType.PlainText) return expression.value ?? defaultValue;

  // TODO - check if computed values are stored

  return defaultValue;
}

/**
 * Gets the values
 * @param expression - The expression
 * @returns
 */
function getExpressionDependencies(expression: ExpressionDescriptor | undefined): string[] {
  if (!expression || expression.type === ExpressionType.PlainText) return [];
  return [];
}

type TextAttributes = {
  text: ExpressionDescriptor;
};
