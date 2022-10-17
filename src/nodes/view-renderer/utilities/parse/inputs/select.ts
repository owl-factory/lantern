
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { SelectDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { validateVariableAccess } from "../../validation";
import { parseChildrenDOM } from "../system";

/**
 * Converts a select element into a select element descriptor
 * @param element The select element to convert
 * @returns A select element descriptor
 */
export function parseSelectElement(element: Element, state: ViewState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Select input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: SelectDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Select,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(element.getAttribute("name") || ""),
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
