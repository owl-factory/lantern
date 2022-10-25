import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes, TableRowAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a table row element into a table row element descriptor
 * @param element The raw <TableRow> element to convert
 * @param state The current state at this point in the parsing
 * @returns A table row element descriptor
 */
 export function parseTableRowElement(element: Element, state: SheetState) {
  const elementDetails: ElementDescriptor<TableRowAttributes> = {
    type: ElementType.TableRow,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
