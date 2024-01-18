import { boxAttributes } from "features/dynamicRender/data/attributes/ui/box";
import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { BoxAttributes } from "features/dynamicRender/types/attributes/ui/box";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a box div element
 */
export function Box(props: RenderComponentProps<BoxAttributes>) {
  const children = useChildren(props.childNodes);
  let displayClass = "block";
  if (props.attributes.type?.toLowerCase() === "inline") displayClass = "inline";

  return <div className={`${displayClass} ${props.attributes.className ?? ""}`}>{children}</div>;
}

export const boxBundle: RenderComponentDefinition = {
  Component: Box,
  nodeType: NodeType.Box,
  attributes: boxAttributes,
  allowsChildren: true,
  backwardsCompatiblityNodeTypes: [NodeType.Border, NodeType.Background, NodeType.Inline],
};
