import { GetOptions, InvalidQueryOptions, QuerySource } from "../types/query";

const INVALID_OPTIONS: InvalidQueryOptions = { source: QuerySource.Invalid };

/**
 * Builds the GetOptions for the given node
 * TODO - this should be split into a function that gets all attributes for a given Component type, and something that parses the result of that into the GetOptions
 * @param node - The element node to extract attributes from
 * @returns A GetOptions object
 */
export function buildQueryOptions(node: Node): GetOptions {
  if (node.nodeType !== node.ELEMENT_NODE) {
    return { ...INVALID_OPTIONS };
  }

  const element = node as Element;
  const source = element.getAttribute("source") ?? "character";
  // TODO - is valid source

  switch (source) {
    case "character":
      return buildCharacterGetOptions(element);
  }
  return { ...INVALID_OPTIONS };
}

/**
 * Builds the GetOptions for a character
 * @param element - The element to parse for information
 * @returns The GetOptions for a character
 */
function buildCharacterGetOptions(element: Element): GetOptions {
  const key = element.getAttribute("name");
  // TODO - is query
  // TODO - is valid name

  return { source: QuerySource.Character, key };
}
