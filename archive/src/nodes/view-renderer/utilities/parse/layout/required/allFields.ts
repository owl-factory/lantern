import { ElementType } from "nodes/view-renderer/enums/elementType";
import { AllFieldsAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts an AllFields element into a AllFields element descriptor
 * @param element The raw <AllFields> element to convert
 * @param state The current state at this point in the parsing
 * @returns An AllFields element descriptor
 */
 export function parseAllFieldsElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<AllFieldsAttributes> = {
    type: ElementType.AllFields,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
  };

  return descriptor;
}
