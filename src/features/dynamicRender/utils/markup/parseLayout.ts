import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { ParsedNode } from "features/dynamicRender/types/render";
import {
  canNodeHaveChildren,
  checkIfUsableNode,
  getNodeName,
  getNodeTypeFromName,
} from "features/dynamicRender/utils/node";
import { getRenderComponentBundle } from "features/dynamicRender/utils/registry";

/**
 * Parses the layout element, extracted the necessary data prior to the render step
 * @param layoutElement - The layout element containing the core document
 * @returns An list of ParsedNodes
 */
export function parseLayoutMarkup(layoutElement: Element): ParsedNode[] {
  // Initialize the high level state, sheet variables
  // const sheetVariablesReferenced: Record<string, true> = {};
  // const stateUsed: Record<string, true> = {};

  const parsedNodes = parseNodeChildren(layoutElement.childNodes);

  return parsedNodes;
}

/**
 * Loops over a list of child NodeList, identifying React keys and parsing them
 * @param childNodes - The children nodes to parse
 */
function parseNodeChildren(childNodes: NodeListOf<ChildNode>): ParsedNode[] {
  if (!childNodes) return [];

  const nodeTypeCount = new Map<string, number>();
  const parsedNodes: ParsedNode[] = [];

  childNodes.forEach((node: ChildNode) => {
    const parsedNode = parseNodeChild(node, nodeTypeCount);
    if (!parsedNode) return;
    parsedNodes.push(parsedNode);
  });

  return parsedNodes;
}

/**
 * Parses a single node child into a ParsedNode object
 * @param node - The node child to parse
 * @param nodeTypeCount - A mapping of the types of nodes encountered. The object value is updated
 * @returns A ParsedNode object containing a key, Component function, and props
 */
function parseNodeChild(
  node: ChildNode,
  nodeTypeCount: Map<string, number>
): ParsedNode | undefined {
  const isUsableNode = checkIfUsableNode(node);
  if (!isUsableNode) return;

  const nodeName = getNodeName(node);
  if (!nodeName) return;

  const nodeType = getNodeTypeFromName(nodeName);

  const nodeCount = (nodeTypeCount.get(nodeType) ?? 0) + 1;
  nodeTypeCount.set(nodeType, nodeCount);

  const key = `${nodeType}_${nodeCount}`;
  const bundle = getRenderComponentBundle(nodeType);

  const attributes = parseAttributes(node, bundle.attributes);

  const hasChildren = canNodeHaveChildren(nodeType);
  let children: ParsedNode[] | undefined = undefined;
  if (hasChildren) {
    children = parseNodeChildren(node.childNodes);
  }

  const parsedNode: ParsedNode = {
    key,
    Component: bundle.Component,
    props: { nodeName, nodeType, node, attributes, childNodes: children },
  };

  return parsedNode;
}

/**
 * Parses the attributes of a node from their definitions.
 * @param node - The node to parse the attributes of
 * @param attributeDefinitions - The definition for the different valid attributes for this kind of node
 * @returns The attributes of a node
 */
function parseAttributes(node: Node, attributeDefinitions: AttributeDefinition[]) {
  if (node.nodeType !== Node.ELEMENT_NODE) return {};
  if (!attributeDefinitions || attributeDefinitions.length === 0) return {};

  const element = node as Element;
  const attributes: Record<string, string> = {};

  attributeDefinitions.forEach((definition: AttributeDefinition) => {
    const name = definition.name;
    const defaultValue = definition.default ?? undefined;
    const value = element.getAttribute(name) ?? defaultValue;

    if (value === undefined) return;
    attributes[name] = value;
  });
  return attributes;
}

export const __testing__ = {
  parseAttributes,
  parseNodeChild,
  parseNodeChildren,
};
