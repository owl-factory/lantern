import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a table row
 */
export function TableRow(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <tr>{children}</tr>;
}

export const tableRowBundle: RenderComponentBundle = {
  Component: TableRow,
  nodeType: NodeType.TableRow,
  attributes: [],
};
