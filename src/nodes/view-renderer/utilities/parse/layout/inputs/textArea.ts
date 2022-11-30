import { ElementType } from "nodes/view-renderer/enums/elementType";
import { TextAreaAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a text area element into a text area element descriptor
 * @param element The text area element to convert
 * @param state The current state at this point in the parsing
 * @returns A text area element descriptor
 */
 export function parseTextAreaElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<TextAreaAttributes> = {
    type: ElementType.TextArea,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      id: parseExpression(element.getAttribute("id")),
      name: parseExpression(element.getAttribute("name")),
    },
  };

  return descriptor;
}
