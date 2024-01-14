import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a box div element
 */
export function Box(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <div>{children}</div>;
}

export const boxBundle: RenderComponentBundle = {
  Component: Box,
  nodeType: NodeType.Box,
  attributes: [],
};
