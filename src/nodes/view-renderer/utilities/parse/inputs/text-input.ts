import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { TextInputDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { validateVariableAccess } from "../../validation";

/**
 * Converts a text input element into a text input element descriptor
 * @param element The text input element to convert
 * @returns A text input element descriptor
 */
export function parseTextInputElement(element: Element, state: ViewState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Text input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: TextInputDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.TextInput,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(name),
  };

  return elementDetails;
}
