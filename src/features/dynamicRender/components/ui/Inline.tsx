import { ParsedNode, RenderComponentProps } from "features/dynamicRender/types/render";
import { parseNodeChildren } from "features/dynamicRender/utils/render";

/**
 * Renders a box with inline children
 */
export function Inline(props: RenderComponentProps) {
  const parsedNodes = parseNodeChildren(props.node.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);
  return <div className="inline-block">{children}</div>;
}
