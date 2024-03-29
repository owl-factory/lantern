import { ElementType } from "nodes/view-renderer/enums/elementType";
import { OptionAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts an option element into an option element descriptor
 * @param element The option element to convert
 * @param state The current state at this point in the parsing
 * @returns A option element descriptor
 */
export function parseOptionElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<OptionAttributes> = {
    type: ElementType.Option,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      value: parseExpression(element.getAttribute("value")),
      text: parseExpression(element.textContent),
    },
  };

  return descriptor;
}
