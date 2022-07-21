import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { parseChildrenElements } from "./children";

/**
 * Converts a page element into a page element descriptor
 * @param element The page element to convert
 * @returns A page element descriptor
 */
export function parsePageElement(element: Element, state: SheetState) {
  const elementDetails: PageDescriptor = {
    $key: state.key,
    element: SheetElementType.Page,
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
