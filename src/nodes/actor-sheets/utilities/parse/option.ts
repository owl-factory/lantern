import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { OptionDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

 /**
 * Converts an option element into an option element descriptor
 * @param element The option element to convert
 * @returns A option element descriptor
 */
export function parseOptionElement(element: Element, state: SheetState) {
  const elementDetails: OptionDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Option,
    value: splitExpressionValue(element.getAttribute("value") || ""),
    text: splitExpressionValue(element.textContent || ""),
  };

  return elementDetails;
}
