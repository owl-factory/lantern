import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { LabelDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

 /**
 * Converts a label element into a label element descriptor
 * @param element The label element to convert
 * @returns A label element descriptor
 */
export function parseLabelElement(element: Element, state: SheetState) {
  const elementDetails: LabelDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Label,
    for: splitExpressionValue(element.getAttribute("for") || ""),
    text: splitExpressionValue(element.textContent || "Unknown"),
  };

  return elementDetails;
}
