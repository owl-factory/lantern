import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type IconAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a box with a background image
 */
export function Icon(props: RenderComponentProps<IconAttributes>) {
  props;
  return <div>Icon</div>;
}

export const iconBundle: RenderComponentDefinition<IconAttributes> = {
  Component: Icon,
  nodeType: NodeType.Icon,
  attributeDefinitions,
  allowsChildren: false,
};
