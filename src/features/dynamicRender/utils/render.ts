import { getRenderComponentByName } from "./registry";
import { ParsedNode } from "../types/render";

/**
 * Parses child elements into a standardized object for easy rendering
 * within a child-bearing component
 * @param childNodes - The children nodes to parse
 */
export function parseNodeChildren(childNodes: NodeListOf<ChildNode>) {
  const nodeTypeCount = new Map<string, number>();
  const parsedNodes: ParsedNode[] = [];

  childNodes.forEach((node: ChildNode) => {
    const isUsableNode = checkIfUsableNode(node);
    if (!isUsableNode) return;

    const nodeName = getNodeName(node);
    let nodeCount = nodeTypeCount.get(nodeName) ?? 0;
    nodeCount += 1;

    const key = `${nodeName}_${nodeCount}`;
    const Component = getRenderComponentByName(nodeName);

    const parsedNode: ParsedNode = { key, Component, props: { nodeName, node } };

    parsedNodes.push(parsedNode);

    nodeTypeCount.set(nodeName, nodeCount);
  });

  return parsedNodes;
}

/**
 * Checks if a node is of a type usable within the DynamicRender
 * @param node - The child node to check
 * @returns True if the node can be used, false otherwise
 */
function checkIfUsableNode(node: ChildNode): boolean {
  const nodeType = node.nodeType;
  switch (nodeType) {
    case node.TEXT_NODE:
      const isOnlyWhitespace = node.textContent.trim().length === 0;
      return !isOnlyWhitespace;

    case node.ELEMENT_NODE:
      return true;
  }
  return false;
}

/**
 * Determines the name of a node, based on the type of node it is, and the tagName (if Element)
 * @param node - The node to determine a name for
 * @returns The tag name as a case-sensitive string
 */
function getNodeName(node: ChildNode) {
  switch (node.nodeType) {
    case node.TEXT_NODE:
      return "text";
    case node.ELEMENT_NODE:
      return (node as Element).tagName ?? "missing-tag";
  }
  return "unknown";
}

/**
 * Determines the value of the checkbox. If none is present, the default is 'on'.
 * @param node - The node to extract the checkbox value from
 * @returns The value of the checkbox. Defaults to 'on'.
 */
export function getAttributeValue(node: Node, attribute: string, defaultValue = ""): string {
  if (node.nodeType !== node.ELEMENT_NODE) return defaultValue;

  const element = node as Element;
  const value: string | null = element.getAttribute(attribute);
  if (value === null) return defaultValue;

  return value.trim();
}
