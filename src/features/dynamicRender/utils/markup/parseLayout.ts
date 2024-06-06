import { Attributes } from "features/dynamicRender/types/attributes";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import {
  ExpressionDescriptor,
  ExpressionType,
  InvalidExpression,
  PlainTextExpression,
} from "features/dynamicRender/types/expression";
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
): ParsedNode<Attributes> | undefined {
  const isUsableNode = checkIfUsableNode(node);
  if (!isUsableNode) return;

  const nodeName = getNodeName(node);
  if (!nodeName) return;

  const nodeType = getNodeTypeFromName(nodeName);

  const nodeCount = (nodeTypeCount.get(nodeType) ?? 0) + 1;
  nodeTypeCount.set(nodeType, nodeCount);

  const key = `${nodeType}_${nodeCount}`;
  const bundle = getRenderComponentBundle(nodeType);

  const attributes = parseAttributes(node, bundle.attributeDefinitions);

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
function parseAttributes(node: Node, attributeDefinitions: AttributeDefinition[]): Attributes {
  if (typeof node !== "object") return {};

  const isElementNode = node?.nodeType === Node.ELEMENT_NODE;
  const isTextNode = node?.nodeType === Node.TEXT_NODE;
  if (!isElementNode && !isTextNode) return {};

  const attributes: Attributes = {};
  if (isTextNode) {
    const textContent = node.textContent ?? "";
    attributes.textContent = parseAttributeExpression(textContent);
    return attributes;
  }

  if (!attributeDefinitions || attributeDefinitions.length === 0) return {};

  const element = node as Element;
  attributeDefinitions.forEach((definition: AttributeDefinition) => {
    const { name, value } = getAttributeValue(element, definition);

    if (value === undefined) return;
    attributes[name] = value;
  });
  return attributes;
}

/**
 * Identifies and fetches an attribute.
 * @param element - The element node containing the attributes
 * @param definition - A single attribute definition
 * @returns An object containing the attribute name and value.
 */
function getAttributeValue(element: Element, definition: AttributeDefinition) {
  const name = definition.name;
  const defaultValue = definition.default ?? undefined;
  let value: ExpressionDescriptor | string | undefined = element.getAttribute(name) ?? defaultValue;
  if (value && definition.supportsExpressions) value = parseAttributeExpression(value);
  return { name, value };
}

/**
 * Parses the given text for expression(s), creating an Expression Descriptor that
 * identifies the variables used and the type of
 * @param text - The text to parse into an ExpressionDescriptor
 * @returns Returns an ExpressionDescriptor
 */
function parseAttributeExpression(text: string): ExpressionDescriptor {
  if (typeof text !== "string")
    return newInvalidExpression("Invalid value given to parseAttributeExpression");

  const hasExpression = checkForExpression(text);
  if (!hasExpression) {
    const plainTextExpression: PlainTextExpression = {
      value: text,
      type: ExpressionType.PlainText,
    };
    return plainTextExpression;
  }

  return newInvalidExpression(
    "Attributes requiring expression evaluation is not currently supported",
    text
  );
}

/**
 * Creates a new invalid expression given the reason for failure and
 * optionally the triggering expression
 * @param why - The reason for why this is invalid
 * @param text - The triggering text, if any
 * @returns A new invalid expression
 */
function newInvalidExpression(why: string, text?: string): InvalidExpression {
  const invalidExpression: InvalidExpression = {
    type: ExpressionType.Invalid,
    why,
    value: text,
  };
  return invalidExpression;
}

/** Matches an expression at the start of the string */
const STARTING_EXPRESSION_REGEX = /^\${(.+)}/;
/** Matches an expression that occurs later and is not escaped by a leading backslash */
const NONESCAPED_EXPRESSION_REGEX = /[^\\]\${(.+)}/;

/**
 * Checks for an expression within a given string
 * @param text - The text to check for an expression
 * @returns True if an expression is found. False otherwise
 */
function checkForExpression(text: string): boolean {
  if (typeof text !== "string") return false;

  const startsWithExpression = STARTING_EXPRESSION_REGEX.test(text);
  if (startsWithExpression) return true;

  const containsNonEscapedExpression = NONESCAPED_EXPRESSION_REGEX.test(text);
  return containsNonEscapedExpression;
}

function extractIndividualExpressions(text: string): string[] {
  if (typeof text !== "string") return [];
  const leadingMatches = [...text.matchAll(new RegExp(STARTING_EXPRESSION_REGEX, "g"))];
  const nonEscapedMatches = [...text.matchAll(new RegExp(NONESCAPED_EXPRESSION_REGEX, "g"))];

  const matches = [...leadingMatches, ...nonEscapedMatches];
  return matches.map((match) => match[1] ?? undefined).filter((match) => match !== undefined);
}

export const __testing__ = {
  checkForExpression,
  extractIndividualExpressions,
  getAttributeValue,
  parseAttributes,
  parseAttributeExpression,
  parseNodeChild,
  parseNodeChildren,
};
