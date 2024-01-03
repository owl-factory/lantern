import { useMemo } from "react";
import { ParsedNode, RenderComponentProps } from "../types/render";
import { parseNodeChildren } from "../utils/node";

/**
 * A helper hook that streamlines the generation of children for DynamicRender components.
 * Note that even placing this below logic of a component may still render before its parent.
 * If using this, be sure that any child logic doesn't depend on the parent.
 * @param props - The common props of a render component
 * @returns An array of JSX.Elements
 */
export function useChildren(props: RenderComponentProps): JSX.Element[] {
  const children = useMemo(() => getChildren(props.node.childNodes), [props.node.childNodes]);
  return children;
}

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
