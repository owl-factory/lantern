import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { InlineDescriptor } from "nodes/actor-sheets/types/elements";
import { parseUnknownElement } from "./unknown";

/**
 * Converts a inline element into a inline element descriptor
 * @param element The inline element to convert
 * @returns A inline element descriptor
 */
export function parseInlineElement(key: string, element: Element, state: SheetState) {
  const elementDetails: InlineDescriptor = {
    element: SheetElementType.Inline,
    children: [],
  };

  for (const childElement of element.children) {
    elementDetails.children.push(parseUnknownElement(key, childElement, state) as any);
  }

  return elementDetails;
}
