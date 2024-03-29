import { ElementType } from "nodes/view-renderer/enums/elementType";
import { InputAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a input element into a input element descriptor
 * @param element The input element to convert
 * @param state The current state at this point in the parsing
 * @returns A input element descriptor
 */
 export function parseInputElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<InputAttributes> = {
    type: ElementType.Input,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      id: parseExpression(element.getAttribute("id")),
      name: parseExpression(element.getAttribute("name")),
      type: element.getAttribute("type") as ("text" | "number") || "text",
    },
  };

  return descriptor;
}

