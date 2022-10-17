
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { CheckboxDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { validateVariableAccess } from "../../validation";

/**
 * Converts a checkbox element into a checkbox element descriptor
 * @param element The checkbox element to convert
 * @returns A checkbox element descriptor
 */
export function parseCheckboxElement(element: Element, state: ViewState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Checkbox input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: CheckboxDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Checkbox,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(name),
    value: splitExpressionValue(element.getAttribute("value") || ""),
  };

  return elementDetails;
}
