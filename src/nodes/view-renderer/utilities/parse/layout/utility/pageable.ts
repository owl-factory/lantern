import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes, PageableAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";
import { parsePageElement } from "./page";

/**
 * Converts a pageable element into a pageable element descriptor
 * @param element The page element to convert
 * @param state The current state at this point in the parsing
 * @returns A page element descriptor
 */
 export function parsePageableElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<PageableAttributes> = {
    type: ElementType.Pageable,
    key: state.key,
    attributes: {
      id: element.getAttribute("id") || "unknown",
      className: parseExpression(element.getAttribute("class") || ""),
      pages: {},
    },
    children: [],
  };

  for (const child of element.children) {
    if (child.tagName !== "Page") { continue; }
    const pageID = child.getAttribute("id") || "unknown";
    const pageDescriptors = parseChildrenElements(child.children, state);
    descriptor.attributes.pages[pageID] = pageDescriptors; // TODO - remove

    descriptor.children?.push(parsePageElement(child, state));
  }

  return descriptor;
}
