import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a Column within a row
 */
export function Column(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <div className="flex-auto">{children}</div>;
}

export const columnBundle: RenderComponentBundle = {
  Component: Column,
  nodeType: NodeType.Column,
  attributes: [],
};
