import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type TableCellAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a Table Cell
 */
export function TableCell(props: RenderComponentProps<TableCellAttributes>) {
  const children = useChildren(props.childNodes);
  return <td>{children}</td>;
}

export const tableCellBundle: RenderComponentDefinition<TableCellAttributes> = {
  Component: TableCell,
  nodeType: NodeType.TableCell,
  attributeDefinitions,
  allowsChildren: true,
};
