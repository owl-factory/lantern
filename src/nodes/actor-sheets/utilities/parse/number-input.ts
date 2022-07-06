import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { NumberInputDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a number input element into a number input element descriptor
 * @param element The number input element to convert
 * @returns A number input element descriptor
 */
export function parseNumberInputElement(element: Element, state: SheetState) {
  const elementDetails: NumberInputDescriptor = {
    element: SheetElementType.NumberInput,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(element.getAttribute("name") || "missing_name"),
  };

  return elementDetails;
}
