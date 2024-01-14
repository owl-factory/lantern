import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a box with a background image
 */
export function Icon(props: RenderComponentProps) {
  props;
  return <div>Icon</div>;
}

export const iconBundle: RenderComponentBundle = {
  Component: Icon,
  nodeType: NodeType.Icon,
  attributes: [],
};
