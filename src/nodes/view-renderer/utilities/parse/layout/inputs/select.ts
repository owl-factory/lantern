import { ElementType } from "nodes/view-renderer/enums/elementType";
import { SelectAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a select element into a select element descriptor
 * @param element The select element to convert
 * @param state The current state at this point in the parsing
 * @returns A select element descriptor
 */
 export function parseSelectElement(element: Element, state: SheetState) {
  const elementDetails: ElementDescriptor<SelectAttributes> = {
    type: ElementType.Select,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      id: parseExpression(element.getAttribute("id")),
      name: parseExpression(element.getAttribute("name")),
    },
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
