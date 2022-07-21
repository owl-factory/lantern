import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { CheckboxDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a checkbox element into a checkbox element descriptor
 * @param element The checkbox element to convert
 * @returns A checkbox element descriptor
 */
export function parseCheckboxElement(element: Element, state: SheetState) {
  const elementDetails: CheckboxDescriptor = {
    $key: state.key,
    element: SheetElementType.Checkbox,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(element.getAttribute("name") || "missing_name"),
    value: splitExpressionValue(element.getAttribute("value") || ""),
  };

  return elementDetails;
}
