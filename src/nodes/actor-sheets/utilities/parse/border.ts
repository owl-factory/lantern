import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { BorderDescriptor } from "nodes/actor-sheets/types/elements";
import { parseUnknownElement } from "./unknown";

/**
 * Converts a border element into a border element descriptor
 * @param key The key of the w
 * @param element The border element to convert
 * @returns A border element descriptor
 */
export function parseBorderElement(key: string, element: Element, state: SheetState) {
  const elementDetails: BorderDescriptor = {
    element: SheetElementType.Border,
    borderStyle: element.getAttribute("borderStyle") || "solid",
    children: [],
  };

  for (const childElement of element.children) {
    elementDetails.children.push(parseUnknownElement(key, childElement, state) as any);
  }

  return elementDetails;
}