import { ParsedNode, RenderComponentProps } from "features/dynamicRender/types/render";
import { parseNodeChildren } from "features/dynamicRender/utils/render";

/**
 * Renders a table
 */
export function Table(props: RenderComponentProps) {
  const parsedNodes = parseNodeChildren(props.node.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);
  children;
  return <table>{"children"}</table>;
}
