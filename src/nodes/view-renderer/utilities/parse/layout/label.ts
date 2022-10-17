
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { LabelDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

 /**
 * Converts a label element into a label element descriptor
 * @param element The label element to convert
 * @returns A label element descriptor
 */
export function parseLabelElement(element: Element, state: ViewState) {
  const elementDetails: LabelDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Label,
    for: splitExpressionValue(element.getAttribute("for") || ""),
    text: splitExpressionValue(element.textContent || "Unknown"),
  };

  return elementDetails;
}
