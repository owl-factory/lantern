import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TokenEditorDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts a TokenEditor element into a TokenEditor element descriptor
 * @param element The raw <TokenEditor> element to convert
 * @returns A TokenEditor element descriptor
 */
export function parseTokenEditorElement(element: Element, state: SheetState) {
  const elementDetails: TokenEditorDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.TokenEditor,
  };

  return elementDetails;
}
