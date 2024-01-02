import { ParsedNode } from "../types/render";
import { parseNodeChildren } from "../utils/render";

/**
 * A helper function for converting a node list into useable JSX.Elements for the Dynamic Render
 * @param childNodes - A list of nodes to convert into JSX.Elements
 * @returns An array of JSX.Elements
 */
export function getChildren(childNodes: NodeListOf<ChildNode>) {
  const parsedNodes = parseNodeChildren(childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);
  return children;
}
