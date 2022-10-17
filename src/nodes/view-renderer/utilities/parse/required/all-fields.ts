
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { AllFieldsDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts an AllFields element into a AllFields element descriptor
 * @param element The raw <AllFields> element to convert
 * @returns An AllFields element descriptor
 */
export function parseAllFieldsElement(element: Element, state: ViewState) {
  const elementDetails: AllFieldsDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.AllFields,
  };

  return elementDetails;
}
