import { ParsedNode, RenderComponentProps } from "features/dynamicRender/types/render";
import { parseNodeChildren } from "features/dynamicRender/utils/render";

/**
 * Renders a Table Cell
 */
export function TableCell(props: RenderComponentProps) {
  const parsedNodes = parseNodeChildren(props.node.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);
  return <td>{children}</td>;
}