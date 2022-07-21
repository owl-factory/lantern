import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TableRowDescriptor } from "nodes/actor-sheets/types/elements";
import { parseChildrenElements } from "./children";

/**
 * Converts a table row element into a table row element descriptor
 * @param element The raw <TableRow> element to convert
 * @returns A table row element descriptor
 */
export function parseTableRowElement(element: Element, state: SheetState) {
  const elementDetails: TableRowDescriptor = {
    $key: state.key,
    element: SheetElementType.TableRow,
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
