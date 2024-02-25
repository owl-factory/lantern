import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type TextAttributes = { text: string };
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps<TextAttributes>) {
  return <>{props.node.textContent?.trim()}</>;
}

export const textBundle: RenderComponentDefinition<TextAttributes> = {
  Component: Text,
  nodeType: NodeType.Text,
  attributeDefinitions,
  allowsChildren: false,
};
