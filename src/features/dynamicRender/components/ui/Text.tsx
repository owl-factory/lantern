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
  const textContent = useExpression();

  return <>{props.node.textContent?.trim()}</>;
}

export const textBundle: RenderComponentDefinition = {
  Component: Text,
  nodeType: NodeType.Text,
  attributes: [],
  allowsChildren: false,
};

function useExpression(expression: Expression | undefined, defaultValue = "") {
  const [value, setValue] = useState(defaultValue);
  const dependencies = getExpressionDependencies(expression);

  useEffect(() => {
    if (!expression) return;
    if (expression.type === ExpressionType.Hardcoded) {
      setValue(expression.value);
      return;
    }
    const 
  }, dependencies);

  return value;
}

/**
 * 
 * @param expression - The expression
 * @returns 
 */
function getExpressionDependencies(expression: Expression | undefined): string[] {
  if (!expression || expression.type === ExpressionType.Hardcoded) return [];
  return [];
}

type TextAttributes = {
  text: Expression;
};

type Expression = HardcodedExpression | ComputedExpression;

type HardcodedExpression = {
  type: ExpressionType.Hardcoded;
  value: string;
};

type ComputedExpression = {
  type: ExpressionType.Computed;
  value: string;
};

enum ExpressionType {
  Hardcoded,
  Computed,
}
