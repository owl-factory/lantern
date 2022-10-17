
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { TableCellDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Converts a table cell element into a table cell element descriptor
 * @param element The raw <TableCell> element to convert
 * @returns A table cell element descriptor
 */
export function parseTableCellElement(element: Element, state: ViewState) {
  const elementDetails: TableCellDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.TableCell,
    width: parseInt(element.getAttribute("width") || element.getAttribute("colspan") || "1"),
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
