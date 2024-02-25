import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type RowAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a flex-box row
 */
export function Row(props: RenderComponentProps<RowAttributes>) {
  const children = useChildren(props.childNodes);
  return <div className="flex">{children}</div>;
}

export const rowBundle: RenderComponentDefinition<RowAttributes> = {
  Component: Row,
  nodeType: NodeType.Row,
  attributeDefinitions,
  allowsChildren: true,
};
