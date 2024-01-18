import { NodeType } from "features/dynamicRender/types/node";
import { getRenderComponentBundle } from "features/dynamicRender/utils/registry";

/**
 * Checks if a node is of a type usable within the DynamicRender
 * @param node - The child node to check
 * @returns True if the node can be used, false otherwise
 */
export function checkIfUsableNode(node: ChildNode): boolean {
  const nodeType = node.nodeType;
  switch (nodeType) {
    case Node.TEXT_NODE: {
      const isOnlyWhitespace = node.textContent.trim().length === 0;
      return !isOnlyWhitespace;
    }
    case Node.ELEMENT_NODE:
      return true;
  }
  return false;
}

/**
 * Checks if a kind of Node can have children
 * @param nodeType - The node type to check
 * @returns True if the node is the sort that can have children, false if not
 */
export function canNodeHaveChildren(nodeType: NodeType): boolean {
  const componentDefinition = getRenderComponentBundle(nodeType);
  if (!componentDefinition) false;

  return componentDefinition.allowsChildren;
}

/**
 * Converts a node or tag name into a NodeType
 * @param nodeName - The name of the node or tag to convert into a NodeType
 * @returns A NodeType. If no matching type is found, returns NodeType.Void
 */
export function getNodeTypeFromName(nodeName: string): NodeType {
  if ((Object.values(NodeType) as string[]).includes(nodeName)) {
    return nodeName as NodeType;
  }

  return NodeType.Void;
}

/**
 * Determines the name of a node, based on the type of node it is, and the tagName (if Element)
 * TODO - return result type instead of optional?
 * @param node - The node to determine a name for
 * @returns The tag name as a case-sensitive string
 */
export function getNodeName(node: ChildNode): string | undefined {
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return NodeType.Text.toString();
    case Node.ELEMENT_NODE:
      return (node as Element).tagName ?? undefined;
  }
  return undefined;
}

/**
 * Determines the value of the checkbox. If none is present, the default is 'on'.
 * @param node - The node to extract the checkbox value from
 * @returns The value of the checkbox. Defaults to 'on'.
 */
export function getAttributeValue(node: Node, attribute: string, defaultValue = ""): string {
  if (node.nodeType !== Node.ELEMENT_NODE) return defaultValue;

  const element = node as Element;
  const value: string | null = element.getAttribute(attribute);
  if (value === null) return defaultValue;

  return value.trim();
}

export const __testing__ = {
  checkIfUsableNode,
  getNodeName,
};
