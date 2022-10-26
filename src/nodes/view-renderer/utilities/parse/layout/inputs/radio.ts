import { ElementType } from "nodes/view-renderer/enums/elementType";
import { RadioAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a radio button element into a radio button element descriptor
 * @param element The radio button element to convert
 * @param state The current state at this point in the parsing
 * @returns A radio button element descriptor
 */
export function parseRadioElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<RadioAttributes> = {
    type: ElementType.Radio,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      id: parseExpression(element.getAttribute("id") || "undefined"),
      name: parseExpression(element.getAttribute("name")),
      value: parseExpression(element.getAttribute("value") || "1"),
      label: parseExpression(element.textContent),
    },
  };

  return descriptor;
}
