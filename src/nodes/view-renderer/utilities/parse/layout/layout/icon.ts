import { ElementType } from "nodes/view-renderer/enums/elementType";
import { IconAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseExpression } from "../expression";

/**
 * Converts a icon element into a icon element descriptor
 * @param element The icon element to convert
 * @param state The current state at this point in the parsing
 * @returns A icon element descriptor
 */
 export function parseIconElement(element: Element, state: SheetState) {
  const elementDetails: ElementDescriptor<IconAttributes> = {
    type: ElementType.Icon,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      icon: parseExpression(element.getAttribute("icon") || "none"),
    },
  };

  return elementDetails;
}
