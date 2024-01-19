import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";

type UseAttributesResult<T> = {
  attributes: Partial<T>;
};

/**
 * Gets the attributes from the given node and returns their value
 * TODO - add handling for queries and data fetching within attributes
 * @param node - The node to read attributes from
 * @param attributeDefinitions - The attribute mapping for the given node
 * @returns An object containing the mapped attributes
 */
export function useAttributes<T>(
  node: Node,
  attributeDefinitions: AttributeDefinition[]
): UseAttributesResult<T> {
  if (node.nodeType !== Node.ELEMENT_NODE) return { attributes: {} };
  const element = node as Element;
  const attributes: Partial<T> = {};

  attributeDefinitions.forEach((definition: AttributeDefinition) => {
    const name = definition.name;
    const defaultValue = definition.default ?? undefined;
    const value = element.getAttribute(name) ?? defaultValue;
    attributes[name] = value;
  });

  return { attributes };
}
