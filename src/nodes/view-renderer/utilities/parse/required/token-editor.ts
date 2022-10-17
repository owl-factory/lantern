
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { TokenEditorDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts a TokenEditor element into a TokenEditor element descriptor
 * @param element The raw <TokenEditor> element to convert
 * @returns A TokenEditor element descriptor
 */
export function parseTokenEditorElement(element: Element, state: ViewState) {
  const elementDetails: TokenEditorDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.TokenEditor,
  };

  return elementDetails;
}
