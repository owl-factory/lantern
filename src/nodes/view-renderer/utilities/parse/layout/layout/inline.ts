import { ElementType } from "nodes/view-renderer/enums/elementType";
import { InlineAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a inline element into a inline element descriptor
 * @param element The inline element to convert
 * @param state The current state at this point in the parsing
 * @returns A inline element descriptor
 */
 export function parseInlineElement(element: Element, state: SheetState) {
  const elementDetails: ElementDescriptor<InlineAttributes> = {
    type: ElementType.Inline,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
