import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { RadioButtonDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a radio button element into a radio button element descriptor
 * @param element The radio button element to convert
 * @returns A radio button element descriptor
 */
export function parseRadioElement(element: Element, state: SheetState) {
  const elementDetails: RadioButtonDescriptor = {
    $key: state.key,
    element: SheetElementType.Radio,
    id: splitExpressionValue(element.getAttribute("id") || "undefined"),
    name: splitExpressionValue(element.getAttribute("name") || "undefined"),
    value: splitExpressionValue(element.getAttribute("value") || "1"),
    label: splitExpressionValue(element.textContent || "Unknown"),
  };

  return elementDetails;
}
