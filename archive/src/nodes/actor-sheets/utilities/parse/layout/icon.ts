import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { IconDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts a icon element into a icon element descriptor
 * @param element The icon element to convert
 * @returns A icon element descriptor
 */
export function parseIconElement(element: Element, state: SheetState) {
  const elementDetails: IconDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Icon,
    icon: element.getAttribute("icon") || "none",
  };

  return elementDetails;
}
