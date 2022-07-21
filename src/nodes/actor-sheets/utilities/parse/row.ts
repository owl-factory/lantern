import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { RowDescriptor } from "nodes/actor-sheets/types/elements";
import { parseChildrenElements } from "./children";

/**
 * Converts a row element into a row element descriptor
 * @param element The row element to convert
 * @returns A row element descriptor
 */
export function parseRowElement(element: Element, state: SheetState) {
  const elementDetails: RowDescriptor = {
    $key: state.key,
    element: SheetElementType.Row,
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
