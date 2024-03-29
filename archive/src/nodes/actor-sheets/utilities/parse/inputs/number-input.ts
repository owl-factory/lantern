import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { NumberInputDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { validateVariableAccess } from "../../validation";

/**
 * Converts a number input element into a number input element descriptor
 * @param element The number input element to convert
 * @returns A number input element descriptor
 */
export function parseNumberInputElement(element: Element, state: SheetState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Number input requires a name"; }
  validateVariableAccess(name);

  const elementDetails: NumberInputDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.NumberInput,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(name),
  };

  return elementDetails;
}
