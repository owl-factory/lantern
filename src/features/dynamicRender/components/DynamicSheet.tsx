import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { ParsedNode } from "features/dynamicRender/types/render";
import { parseNodeChildren } from "features/dynamicRender/utils/node";
import { useContext } from "react";

/**
 * Renders the Sheet portion of a DynamicRender
 */
export function DynamicSheet() {
  const { markup } = useContext(DynamicContext);

  const layout: Element = markup.layout;
  if (layout === undefined) return <></>;

  const parsedNodes = parseNodeChildren(layout.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);
  return <>{children}</>;
}
