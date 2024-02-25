import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type BoxAttributes = {
  className?: string;
  type?: string;
};
const attributeDefinitions: AttributeDefinition[] = [{ name: "className" }, { name: "type" }];

/**
 * Renders a box div element
 */
export function Box(props: RenderComponentProps<BoxAttributes>) {
  const children = useChildren(props.childNodes ?? []);
  let displayClass = "block";
  if (props.attributes.type?.toLowerCase() === "inline") displayClass = "inline";

  return <div className={`${displayClass} ${props.attributes.className ?? ""}`}>{children}</div>;
}

export const boxBundle: RenderComponentDefinition<BoxAttributes> = {
  Component: Box,
  nodeType: NodeType.Box,
  attributeDefinitions,
  allowsChildren: true,
  backwardsCompatiblityNodeTypes: [NodeType.Border, NodeType.Background, NodeType.Inline],
};
