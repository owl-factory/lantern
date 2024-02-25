import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type ColumnAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a Column within a row
 */
export function Column(props: RenderComponentProps<ColumnAttributes>) {
  const children = useChildren(props.childNodes);
  return <div className="flex-auto">{children}</div>;
}

export const columnBundle: RenderComponentDefinition<ColumnAttributes> = {
  Component: Column,
  nodeType: NodeType.Column,
  attributeDefinitions,
  allowsChildren: true,
};
