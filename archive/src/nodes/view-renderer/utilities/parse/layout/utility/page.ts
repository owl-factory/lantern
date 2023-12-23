import { ElementType } from "nodes/view-renderer/enums/elementType";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseChildrenElements } from "../children";

/**
 * Converts a page element into a page element descriptor
 * @param element The page element to convert
 * @param state The current state at this point in the parsing
 * @returns A page element descriptor
 */
export function parsePageElement(element: Element, state: ParseState) {
  const elementDetails: ElementDescriptor<{}> = {
    type: ElementType.Page,
    key: state.key,
    children: [],
    attributes: {},
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
