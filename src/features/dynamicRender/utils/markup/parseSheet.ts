import { Prefabs, Variables } from "features/dynamicRender/types/controllers/markup";
import { ParsedNode } from "features/dynamicRender/types/render";
import { parseLayoutMarkup } from "features/dynamicRender/utils/markup/parseLayout";
import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";

export type MarkupComponents = {
  layout: ParsedNode[];
  variables?: Variables;
  prefabs?: Prefabs;
};

/**
 * Parses a markup document for Dynamic Render into layout, variables, and prefabs.
 * @param markup - The Markup DOM to parse
 * @returns A result with an Ok object containing the layout element, a variables object, and a prefabs object
 */
export function parseMarkup(markup: string): Result<MarkupComponents, string> {
  if (!markup) return Err("XML Parsing Error: empty XML string provided");

  const parser = new DOMParser();
  let markupDom: Document;
  try {
    markupDom = parser.parseFromString(markup, "application/xml");
  } catch (why) {
    return Err(why);
  }

  const sheetElement = findFirstElementByTag(markupDom, "Sheet");
  if (sheetElement === undefined) return Err("No Sheet found within the root level of the Markup.");

  const layoutElement = findFirstElementByTag(sheetElement, "Layout");
  if (layoutElement === undefined) return Err("No Layout element found within the Sheet element");

  const layout = parseLayoutMarkup(layoutElement);

  const variablesElement = findFirstElementByTag(sheetElement, "Variables");
  const variables = parseVariables(variablesElement);

  const prefabsElement = findFirstElementByTag(sheetElement, "Prefabs");
  const prefabs = parsePrefabs(prefabsElement);

  const markupComponents: MarkupComponents = {
    layout,
    variables,
    prefabs,
  };

  return Ok(markupComponents);
}

/**
 * Searches through the top layer of a given DOM or element to find an element with the matching tag name
 * @param dom - The Document Object Model or Element to search through
 * @param tagName - The name of the tag to find. Case-sensitive.
 * @returns The element, if found. Undefined otherwise.
 */
export function findFirstElementByTag(dom: Document | Element, tagName: string) {
  let matchingElement: Element;
  dom.childNodes.forEach((childNode: ChildNode) => {
    if (childNode.nodeType !== Node.ELEMENT_NODE) return;

    const childElement = childNode as Element;
    if (childElement.tagName === tagName) {
      matchingElement = childElement;
    }
  });
  return matchingElement;
}

function parseVariables(variablesElement: Element | undefined): Variables {
  if (variablesElement === undefined) return {};
  // TODO
  return {};
}

function parsePrefabs(prefabsElement: Element | undefined): Prefabs {
  if (prefabsElement === undefined) return {};
  // TODO
  return {};
}
