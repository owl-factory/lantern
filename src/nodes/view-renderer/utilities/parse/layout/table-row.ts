
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { TableRowDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Converts a table row element into a table row element descriptor
 * @param element The raw <TableRow> element to convert
 * @returns A table row element descriptor
 */
export function parseTableRowElement(element: Element, state: ViewState) {
  const elementDetails: TableRowDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.TableRow,
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
