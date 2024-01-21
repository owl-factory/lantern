import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

/**
 * Renders a Column within a row
 */
export function Column(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <div className="flex-auto">{children}</div>;
}

export const columnBundle: RenderComponentDefinition = {
  Component: Column,
  nodeType: NodeType.Column,
  attributes: [],
  allowsChildren: true,
};
