import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes, TokenEditorAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a TokenEditor element into a TokenEditor element descriptor
 * @param element The raw <TokenEditor> element to convert
 * @param state The current state at this point in the parsing
 * @returns A TokenEditor element descriptor
 */
 export function parseTokenEditorElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<TokenEditorAttributes> = {
    type: ElementType.TokenEditor,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
  };

  return descriptor;
}
