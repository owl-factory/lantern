import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { Attribute } from "features/dynamicRender/types/attributes";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { containsExpression } from "features/dynamicRender/utils/expression";
import { useContext } from "react";

function useAttribute(attribute: Attribute) {
  const context = useContext(DynamicContext);
  if (attribute.isExpression === false) return attribute.value;
  context;
  return "";
}

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps<{ text: Attribute }>) {
  const text = useAttribute(props.attributes.text);

  return <>{text}</>;
}

export const textBundle: RenderComponentDefinition = {
  Component: Text,
  nodeType: NodeType.Text,
  attributes: [],
  allowsChildren: false,
  customParsing,
};

function customParsing(node: Node, attributes: Record<string, Attribute>) {
  const textContent = node.textContent;
  if (!containsExpression(textContent)) {
    attributes.text = { value: textContent, isExpression: false };
    return;
  }
}
