import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps) {
  return <>{props.node.textContent.trim()}</>;
}

export const textBundle: RenderComponentDefinition = {
  Component: Text,
  nodeType: NodeType.Text,
  attributes: [],
  allowsChildren: false,
};
