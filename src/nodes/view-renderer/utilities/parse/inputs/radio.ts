
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { RadioButtonDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { validateVariableAccess } from "../../validation";

/**
 * Converts a radio button element into a radio button element descriptor
 * @param element The radio button element to convert
 * @returns A radio button element descriptor
 */
export function parseRadioElement(element: Element, state: ViewState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Radio input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: RadioButtonDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Radio,
    id: splitExpressionValue(element.getAttribute("id") || "undefined"),
    name: splitExpressionValue(name),
    value: splitExpressionValue(element.getAttribute("value") || "1"),
    label: splitExpressionValue(element.textContent || ""),
  };

  return elementDetails;
}
