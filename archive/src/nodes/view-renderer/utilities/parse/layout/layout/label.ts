import { ElementType } from "nodes/view-renderer/enums/elementType";
import { LabelAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a label element into a label element descriptor
 * @param element The label element to convert
 * @param state The current state at this point in the parsing
 * @returns A label element descriptor
 */
export function parseLabelElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<LabelAttributes> = {
    type: ElementType.Label,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      for: parseExpression(element.getAttribute("for")),
      text: parseExpression(element.textContent),
    },
  };

  return descriptor;
}
