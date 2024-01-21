import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

/**
 * Renders a box with a background image
 */
export function Icon(props: RenderComponentProps) {
  props;
  return <div>Icon</div>;
}

export const iconBundle: RenderComponentDefinition = {
  Component: Icon,
  nodeType: NodeType.Icon,
  attributes: [],
  allowsChildren: false,
};
