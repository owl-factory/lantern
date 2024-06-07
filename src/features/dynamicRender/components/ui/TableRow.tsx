import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type TableRowAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a table row
 */
export function TableRow(props: RenderComponentProps<TableRowAttributes>) {
  const children = useChildren(props.childNodes);
  return <tr>{children}</tr>;
}

export const tableRowBundle: RenderComponentDefinition<TableRowAttributes> = {
  Component: TableRow,
  nodeType: NodeType.TableRow,
  attributeDefinitions,
  allowsChildren: true,
};
