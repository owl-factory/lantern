import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { BackgroundDescriptor } from "nodes/actor-sheets/types/elements";
import { parseUnknownElement } from "./unknown";

/**
 * Converts a background element into a background element descriptor
 * @param element The background element to convert
 * @returns A background element descriptor
 */
export function parseBackgroundElement(key: string, element: Element, state: SheetState) {
  const elementDetails: BackgroundDescriptor = {
    element: SheetElementType.Background,
    src: element.getAttribute("src") || "",
    children: [],
  };

  for (const childElement of element.children) {
    elementDetails.children.push(parseUnknownElement(key, childElement, state) as any);
  }

  return elementDetails;
}
