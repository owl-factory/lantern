import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { SelectDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";
import { validateVariableAccess } from "../validation";
import { parseChildrenElements } from "./children";

/**
 * Converts a select element into a select element descriptor
 * @param element The select element to convert
 * @returns A select element descriptor
 */
export function parseSelectElement(element: Element, state: SheetState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Select input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: SelectDescriptor = {
    $key: state.key,
    element: SheetElementType.Select,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(element.getAttribute("name") || ""),
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
