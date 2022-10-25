import { ElementType } from "nodes/view-renderer/enums/elementType";
import { RowAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a row element into a row element descriptor
 * @param element The row element to convert
 * @returns A row element descriptor
 */
 export function parseRowElement(element: Element, state: SheetState) {
  const elementDetails: ElementDescriptor<RowAttributes> = {
    type: ElementType.Row,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
