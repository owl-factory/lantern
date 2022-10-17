
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { IconDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts a icon element into a icon element descriptor
 * @param element The icon element to convert
 * @returns A icon element descriptor
 */
export function parseIconElement(element: Element, state: ViewState) {
  const elementDetails: IconDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Icon,
    icon: element.getAttribute("icon") || "none",
  };

  return elementDetails;
}
