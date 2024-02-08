import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { useState } from "react";

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps) {
  const textContent = useExpression()

  return <>{props.node.textContent?.trim()}</>;
}

export const textBundle: RenderComponentDefinition = {
  Component: Text,
  nodeType: NodeType.Text,
  attributes: [],
  allowsChildren: false,
};

function useExpression(defaultValue = "") {
  const [value, setValue] = useState(defaultValue);

  return value;
}

type TextAttributes = {
  text: 
}

