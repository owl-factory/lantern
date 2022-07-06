import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TextAreaDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a select element into a select element descriptor
 * @param element The select element to convert
 * @returns A select element descriptor
 */
export function parseSelectElement(element: Element, state: SheetState) {
  const elementDetails: TextAreaDescriptor = {
    element: SheetElementType.Select,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(element.getAttribute("name") || ""),
  };

  return elementDetails;
}
