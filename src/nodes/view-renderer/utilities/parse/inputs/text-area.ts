
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { TextAreaDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { validateVariableAccess } from "../../validation";

/**
 * Converts a text area element into a text area element descriptor
 * @param element The text area element to convert
 * @returns A text area element descriptor
 */
export function parseTextAreaElement(element: Element, state: ViewState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Text Area input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: TextAreaDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.TextArea,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(name),
  };

  return elementDetails;
}
