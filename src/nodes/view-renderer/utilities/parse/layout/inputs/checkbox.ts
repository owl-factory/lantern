import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a checkbox element into a checkbox element descriptor
 * @param element The checkbox element to convert
 * @param state The current state at this point in the parsing
 * @returns A checkbox element descriptor
 */
export function parseCheckboxElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<CheckboxAttributes> = {
    type: ElementType.Checkbox,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      id: parseExpression(element.getAttribute("id")),
      name: parseExpression(element.getAttribute("name")),
      value: parseExpression(element.getAttribute("value")),
    },
  };

  return descriptor;
}
