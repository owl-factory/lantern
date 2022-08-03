import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { RadioButtonDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";
import { validateVariable } from "../validation";

/**
 * Converts a radio button element into a radio button element descriptor
 * @param element The radio button element to convert
 * @returns A radio button element descriptor
 */
export function parseRadioElement(element: Element, state: SheetState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Radio input requires a name"; }
  validateVariable(name);

  const elementDetails: RadioButtonDescriptor = {
    $key: state.key,
    element: SheetElementType.Radio,
    id: splitExpressionValue(element.getAttribute("id") || "undefined"),
    name: splitExpressionValue(name),
    value: splitExpressionValue(element.getAttribute("value") || "1"),
    label: splitExpressionValue(element.textContent || ""),
  };

  return elementDetails;
}
