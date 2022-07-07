import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TextInputDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a text input element into a text input element descriptor
 * @param element The text input element to convert
 * @returns A text input element descriptor
 */
export function parseTextInputElement(element: Element, state: SheetState) {
  const elementDetails: TextInputDescriptor = {
    $key: state.key,
    element: SheetElementType.TextInput,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(element.getAttribute("name") || "missing_name"),
  };

  return elementDetails;
}
