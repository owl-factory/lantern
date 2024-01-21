import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

/**
 * Renders a Table Cell
 */
export function TableCell(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <td>{children}</td>;
}

export const tableCellBundle: RenderComponentDefinition = {
  Component: TableCell,
  nodeType: NodeType.TableCell,
  attributes: [],
  allowsChildren: true,
};
