import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { InlineDescriptor } from "nodes/actor-sheets/types/elements";
import { parseChildrenElements } from "./children";

/**
 * Converts a inline element into a inline element descriptor
 * @param element The inline element to convert
 * @returns A inline element descriptor
 */
export function parseInlineElement(element: Element, state: SheetState) {
  const elementDetails: InlineDescriptor = {
    $key: state.key,
    element: SheetElementType.Inline,
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
