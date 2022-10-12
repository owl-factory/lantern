import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TableCellDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenElements } from "../children";

/**
 * Converts a table cell element into a table cell element descriptor
 * @param element The raw <TableCell> element to convert
 * @returns A table cell element descriptor
 */
export function parseTableCellElement(element: Element, state: SheetState) {
  const elementDetails: TableCellDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.TableCell,
    width: parseInt(element.getAttribute("width") || element.getAttribute("colspan") || "1"),
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
