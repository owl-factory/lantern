import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { parseUnknownElement } from "./unknown";

/**
 * Converts a page element into a page element descriptor
 * @param element The page element to convert
 * @returns A page element descriptor
 */
export function parsePageElement(key: string, element: Element, state: SheetState) {
  const elementDetails: PageDescriptor = {
    element: SheetElementType.Page,
    children: [],
  };

  for (const childElement of element.children) {
    elementDetails.children.push(parseUnknownElement(key, childElement, state) as any);
  }

  return elementDetails;
}
