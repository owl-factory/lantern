import { ElementType } from "nodes/view-renderer/enums/elementType";
import { IconAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a icon element into a icon element descriptor
 * @param element The icon element to convert
 * @param state The current state at this point in the parsing
 * @returns A icon element descriptor
 */
 export function parseIconElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<IconAttributes> = {
    type: ElementType.Icon,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      icon: parseExpression(element.getAttribute("icon") || "none"),
    },
  };

  return descriptor;
}
