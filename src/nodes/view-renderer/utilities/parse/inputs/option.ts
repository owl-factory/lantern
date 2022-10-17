
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { OptionDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

 /**
 * Converts an option element into an option element descriptor
 * @param element The option element to convert
 * @returns A option element descriptor
 */
export function parseOptionElement(element: Element, state: ViewState) {
  const elementDetails: OptionDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Option,
    value: splitExpressionValue(element.getAttribute("value") || ""),
    text: splitExpressionValue(element.textContent || ""),
  };

  return elementDetails;
}
